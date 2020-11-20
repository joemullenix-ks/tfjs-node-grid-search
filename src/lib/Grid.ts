'use strict';


//BUG: This require() crashes (logged as https://github.com/tensorflow/tfjs/issues/4052):
//
//	const TENSOR_FLOW = require('@tensorflow/tfjs-node');
//
//NOTE: Confirmed that this file exists. However, building w/ tfjs-node reports module not found:
//	<project>\node_modules\@tensorflow\tfjs-node\lib\napi-v6
//	<project>\node_modules\@tensorflow\tfjs-node\lib\napi-v6\tfjs_binding.node
const TENSOR_FLOW = require('@tensorflow/tfjs');


const { AxisSet }				= require('./AxisSet');
const { AxisSetTraverser }		= require('./AxisSetTraverser');
const { EpochStats }			= require('./EpochStats');
const { GridOptions }			= require('./GridOptions');
const { GridRunStats }			= require('./GridRunStats');
const { IterationResult }		= require('./IterationResult');
const { ModelParams }			= require('./ModelParams');
const { ModelStatics }			= require('./ModelStatics');
const { ModelTestStats }		= require('./ModelTestStats');
const { SessionData }			= require('./SessionData');
const { Utils }					= require('./Utils');


import * as Types from '../ts_types/Grid';


import * as Axis from './Axis';


class Grid {
	_axisSetTraverser: typeof AxisSetTraverser;
	_epochStats: typeof EpochStats;
	_gridRunStats: typeof GridRunStats;
	_timeStartBatch: number = 0;
	_timeStartEpoch: number = 0;
	_timeStartGrid: number = 0;
	_timeStartIteration: number = 0;

	constructor(axisSet: typeof AxisSet,
				private _modelStatics: typeof ModelStatics,
				private _sessionData: typeof SessionData,
				private _callbackEvaluatePrediction: Types.CallbackEvaluatePrediction,
				private _gridOptions?: typeof GridOptions,
				private _callbackReportIteration?: Types.CallbackReportIteration,
				private _callbackReportEpoch?: Types.CallbackReportEpoch,
				private _callbackReportBatch?: Types.CallbackReportBatch) {

		console.log('\n' + 'Instantiating Grid...');

		// if the user doesn't provide an options block, we'll setup defaults
		if (!this._gridOptions) {
			this._gridOptions = new GridOptions();
		}

		this._axisSetTraverser = new AxisSetTraverser(axisSet);

		// prune (and warn about) any model params that are pre-empted by a dynamic axis
		this.ResolveModelDefinition();
	}

	CreateModel(modelParams: typeof ModelParams) {
		const TOTAL_INPUT_NEURONS = this._sessionData.totalInputNeurons;
		const TOTAL_OUTPUT_NEURONS = this._sessionData.totalOutputNeurons;

		const TOTAL_HIDDEN_LAYERS = modelParams.GetParam(Axis.Names.LAYERS);

		const TF_MODEL = TENSOR_FLOW.sequential();

		if (TOTAL_HIDDEN_LAYERS === 0) {
			// this network goes directly from input to output, e.g. single layer perceptron
			TF_MODEL.add(TENSOR_FLOW.layers.dense(	{
														inputShape: [TOTAL_INPUT_NEURONS],
														units: TOTAL_OUTPUT_NEURONS,
														activation: modelParams.GetParam('activationOutput'), //HARD-CODER; TODO: Add this as a managed Axis type, or define it ... somewhere.
														useBias: true,
														kernelInitializer: this._modelStatics.GenerateInitializerKernel(),
														biasInitializer: this._modelStatics.GenerateInitializerBias()
													}));
		}
		else {
			// add the first hidden layer, which takes the inputs (TF has no discrete 'input layer')
			TF_MODEL.add(TENSOR_FLOW.layers.dense(	{
														inputShape: [TOTAL_INPUT_NEURONS],
														units: modelParams.GetParam(Axis.Names.NEURONS),
														activation: modelParams.GetParam('activationInput'), //HARD-CODER; TODO: Add this as a managed Axis.
														useBias: true,
														kernelInitializer: this._modelStatics.GenerateInitializerKernel(),
														biasInitializer: this._modelStatics.GenerateInitializerBias()
													}));

			// add the remaining hidden layers; one-based, because of the built-in input layer
			for (let i = 1; i < TOTAL_HIDDEN_LAYERS; ++i) {
				TF_MODEL.add(TENSOR_FLOW.layers.dense(	{
															units: modelParams.GetParam(Axis.Names.NEURONS),
															activation: modelParams.GetParam('activationHidden'), //HARD-CODER; TODO: Add this as a managed Axis.
															useBias: true,
															kernelInitializer: this._modelStatics.GenerateInitializerKernel(),
															biasInitializer: this._modelStatics.GenerateInitializerBias()
														}));
			}

			TF_MODEL.add(TENSOR_FLOW.layers.dense(	{
														units: TOTAL_OUTPUT_NEURONS,
														activation: modelParams.GetParam('activationOutput'), //HARD-CODER; TODO: Add this as a managed Axis.
														useBias: true,
														biasInitializer: this._modelStatics.GenerateInitializerBias()
													}));
		}

//TODO: Print these, but only under a verbocity setting (way too spammy)
//		TF_MODEL.summary();

		// compile the model, which prepares it for training
		TF_MODEL.compile(	{
								optimizer: this._modelStatics.GenerateOptimizer(modelParams.GetParam(Axis.Names.LEARN_RATE)),
								loss: this._modelStatics.GenerateLossFunction(),
								metrics: 'accuracy'
							});

		return TF_MODEL;
	}

	ResetEpochStats() {
//NOTE: This is currently only used by the reporting callback. It's contents, however, will be critical to tracking
//		overfit and stuck situations, as well as things like Smart Start(tm) (restarting unlucky iterations).
		this._epochStats = new EpochStats(this._gridOptions.epochStatsDepth);
	}

	async Run() {
		this._gridRunStats = new GridRunStats();

		const TOTAL_ITERATIONS = this._axisSetTraverser.totalIterations;

		const TOTAL_PASSES = TOTAL_ITERATIONS * this._gridOptions.repetitions;

		let pass = 0;

		this._timeStartGrid = Date.now();

		for (let i = 0; !this._axisSetTraverser.traversed; ++i) {
			const DYNAMIC_PARAMS = this._axisSetTraverser.CreateIterationParams();

			const STATIC_PARAMS = this._modelStatics.ShallowCloneParams();

			const MODEL_PARAMS = new ModelParams(DYNAMIC_PARAMS, STATIC_PARAMS);

			for (let r = 0; r < this._gridOptions.repetitions; ++r) {
				console.log('________________________________________________________________');
				console.log('Pass ' + (1 + pass) + '/' + TOTAL_PASSES
							+ ' (Iteration ' + (1 + i) + '/' + TOTAL_ITERATIONS
							+ ', Repetition ' + (1 + r) + '/' + this._gridOptions.repetitions + ')'
							+ '\n' + this._axisSetTraverser.WriteReport(false)); // non-compact report

				++pass;

				this._timeStartIteration = Date.now();

				// reset these, for the first report of the upcoming iteration
				this._timeStartBatch = this._timeStartIteration;
				this._timeStartEpoch = this._timeStartIteration;

				const MODEL = this.CreateModel(MODEL_PARAMS);

				await this.TrainModel(MODEL, MODEL_PARAMS);

				const ITERATION_DURATION = Date.now() - this._timeStartIteration;

				const MODEL_TEST_STATS = this.TestModel(MODEL, MODEL_PARAMS, ITERATION_DURATION);

				const ITERATION_RESULT = new IterationResult(	i,
																this._axisSetTraverser.LookupIterationDescriptor(i),
																this._epochStats,
																MODEL_PARAMS,
																MODEL_TEST_STATS,
																r,
																ITERATION_DURATION);

				this._gridRunStats.AddIterationResult(ITERATION_RESULT);
			}

			this._axisSetTraverser.Advance();
		}

		const GRID_TIME_END = Date.now();

		const GRID_DURATION = GRID_TIME_END - this._timeStartGrid;

		console.log('\n' + '<< GRID SEARCH COMPLETE >>',
					'\n',
					'\n' + 'started @ ' + (new Date(this._timeStartGrid)).toLocaleString(),
					'\n' + '  ended @ ' + (new Date(GRID_TIME_END)).toLocaleString(),
					'\n' + 'duration: ' + Utils.WriteDurationReport(GRID_DURATION),
					'\n');

		console.log('Results (sorted by score)');
		console.log(this._gridRunStats.WriteReport(true));

		if (typeof this._gridOptions.writeResultsToDirectory === 'string') {
			const { FileIO } = require('./FileIO');

			const RESULT = {};

			const FILENAME = FileIO.ProduceResultsFilename();

			await FileIO.WriteResultsFile(	FILENAME,
											this._gridOptions.writeResultsToDirectory,
											this._gridRunStats.WriteCSV(),
											RESULT);

//TODO: Look into Node's os/platform library. Gotta be a way to pull the appropriate slashes.
//		...and on the same pass, lookup and print the root directory.
			console.log('\n'
						+ 'Results file written as '
						+ (this._gridOptions.writeResultsToDirectory === ''
							? './'
							: this._gridOptions.writeResultsToDirectory + '/')
						+ FILENAME);
		}
	}

	ResolveModelDefinition() {
//NOTE: TODO: Not entirely happy with this. It feels like access breaking; reaching in via callback.
//			  It would be better to just produce a list of axis keys. That's all we want, anyway.
//			  ...will leave this pending the completion of the supported axes. There may be more
//			  to consider when it comes to complex axes like activator-schedules.

		// ensure the static and dynamic model parameters have no overlap, by stripping any dupes from the statics
		this._axisSetTraverser.ExamineAxisNames((axisKey: string) => {
			this._modelStatics.AttemptStripParam(axisKey);
		});
	}

//TODO: This model type might be too strict. Consider the lower-level TF LayersModel.
	TestModel(model: typeof TENSOR_FLOW.Sequential, modelParams: typeof ModelParams, duration: number) {
		console.assert(model.built);
		console.assert(duration >= 0);

		console.log('Testing...');

		// run the unseen data through this trained model
		const PREDICTIONS_TENSOR = model.predict(	this._sessionData.proofInputsTensor,
													{
														batchSize: modelParams.GetParam(Axis.Names.BATCH_SIZE),
//NOTE: 'verbose' is not implemented as of TF 2.7.0. The documentation is wrong, but it's noted in the lib (see model.ts).
														verbose: false
													});

		// convert this TF Tensor into array form, for human-friendly analysis
		const PREDICTIONS = PREDICTIONS_TENSOR.arraySync();

		// pull the unstandardized proof cases (again, for the human-friendly report)

		const PROOF_INPUTS = this._sessionData.rawInputsProof;

		const PROOF_TARGETS = this._sessionData.proofTargets;

		console.assert(PROOF_TARGETS.length === PREDICTIONS.length); // sanity-check

		if (this._callbackReportIteration) {
			this._callbackReportIteration(duration, PREDICTIONS, PROOF_INPUTS, PROOF_TARGETS);
		}

		// we now 'score' the predictions by tallying the responses from the user's callback

		let aggregateDeltaCorrect = 0.0;
		let aggregateDeltaIncorrect = 0.0;

		let totalCorrect = 0;

		for (let i = 0; i < PREDICTIONS.length; ++i) {
			const EVALUATION = this._callbackEvaluatePrediction(PROOF_TARGETS[i], PREDICTIONS[i]);

			if (EVALUATION.correct) {
				++totalCorrect;

				aggregateDeltaCorrect += EVALUATION.delta;
			}
			else {
				aggregateDeltaIncorrect += EVALUATION.delta;
			}
		}

		const MODEL_TEST_STATS = new ModelTestStats(aggregateDeltaCorrect,
													aggregateDeltaIncorrect,
													totalCorrect,
													PREDICTIONS.length);

		console.log('Test complete. Score: ' + (100 * MODEL_TEST_STATS.CalculateScore()).toFixed(3) + '%');

		return MODEL_TEST_STATS;
	}

//TODO: This model type might be too strict. Consider the lower-level TF LayersModel.
	async TrainModel(model: typeof TENSOR_FLOW.Sequential, modelParams: typeof ModelParams) {
		console.assert(model.built);

		this.ResetEpochStats()

		const TOTAL_CASES = this._sessionData.totalTrainingCases;

//NOTE: ceil() is how TF performs this same split, as of v2.7.0.
		const TOTAL_VALIDATION_CASES = Math.ceil(TOTAL_CASES * modelParams.GetParam(Axis.Names.VALIDATION_SPLIT));

		const TOTAL_TRAINING_CASES = TOTAL_CASES - TOTAL_VALIDATION_CASES;

		if (TOTAL_VALIDATION_CASES <= this._gridOptions.validationSetSizeMin) {
			console.warn('Validation split is extremely low, and may not produce useful results.');
		}

		if (TOTAL_TRAINING_CASES <= this._gridOptions.validationSetSizeMin) {
			console.warn('Validation split is extremely high, and may not produce useful results.');
		}

		const TOTAL_EPOCHS = modelParams.GetParam(Axis.Names.EPOCHS);

		console.log('Training with ' + TOTAL_CASES + ' cases ('
					+ TOTAL_TRAINING_CASES + ' train, '
					+ TOTAL_VALIDATION_CASES + ' validate) '
					+ 'for ' + TOTAL_EPOCHS + ' epochs...');

		await model.fit(this._sessionData.trainingInputsTensor,
						this._sessionData.trainingTargetsTensor,
						{
							batchSize: modelParams.GetParam(Axis.Names.BATCH_SIZE),
							epochs: TOTAL_EPOCHS,
							shuffle: true,
							verbose: 2,
//NOTE: Validation is only performed if we provide this "validationSplit" arg. It's necessary to track overfit and stuck.
							validationSplit: modelParams.GetParam(Axis.Names.VALIDATION_SPLIT),
							callbacks:
							{
//NOTE: These events are available, as of TF 2.7.0:
// 								onTrainBegin: (logs) => { console.log('onTrainBegin', logs); },
// 								onTrainEnd: (logs) => { console.log('onTrainEnd', logs); },
// 								onEpochBegin: (epoch, logs) => { console.log('onEpochBegin', epoch, logs); },
// 								onEpochEnd: (epoch, logs) => { console.log('onEpochEnd', epoch, logs); },
// 								onBatchBegin: (batch, logs) => { console.log('onBatchBegin', batch, logs); },
// 								onBatchEnd: (batch, logs) => { console.log('onBatchEnd', batch, logs); },
// 								onYield: (epoch, batch, logs) => { console.log('onYield', epoch, batch, logs); }

//[[TF ANY]]
								onBatchEnd: (batch: any, logs: any) => {
//TODO: This is essentially duped by the Epoch handler (just below).
									if (!this._callbackReportBatch) {
										return;
									}

									const TIME_NOW = Date.now();

									const DURATION_BATCH = TIME_NOW - this._timeStartBatch;

									this._timeStartBatch = TIME_NOW;

									this._callbackReportBatch(DURATION_BATCH, batch, logs);
								},
//[[TF ANY]]
								onEpochEnd: (epoch: number, logs: any) => {
									this._epochStats.Update(epoch, logs);

									const TIME_NOW = Date.now();

									const DURATION_EPOCH = TIME_NOW - this._timeStartEpoch;

									this._timeStartEpoch = TIME_NOW;

									if (this._callbackReportEpoch) {
										this._callbackReportEpoch(DURATION_EPOCH, epoch, logs, this._epochStats);
										return;
									}

									if (epoch === 0) {
										console.log(EpochStats.ReportGuide);
									}

									console.log((1 + epoch) + '/' + TOTAL_EPOCHS, this._epochStats.WriteReport());
								}
							}
						});
	}
}


Object.freeze(Grid);

export { Grid };
