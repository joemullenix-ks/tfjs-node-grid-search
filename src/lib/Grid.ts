'use strict';


//NOTE: This variant of the lib (tfjs-node) is not yet part of a proper release (as of 2.7.0)!
//		See https://github.com/tensorflow/tfjs/issues/4052 for the issue and a _workaround_ (not a proper
//		solution yet), which involves manually copying this file:
//
//			copy tensorflow.dll
//			from: node_modules\@tensorflow\tfjs-node\deps\lib
//			  to: node_modules\@tensorflow\tfjs-node\lib\napi-v6


import * as TENSOR_FLOW from '@tensorflow/tfjs-node';
import { ActivationIdentifier } from '@tensorflow/tfjs-layers/dist/keras_format/activation_config';


import * as Types from './types';


import * as Axis				from './Axis';
import { AxisSet }				from './AxisSet';
import { AxisSetTraverser }		from './AxisSetTraverser';
import { EpochStats }			from './EpochStats';
import * as FileIO				from './FileIO';
import { GridOptions }			from './GridOptions';
import { GridRunStats }			from './GridRunStats';
import { IterationResult }		from './IterationResult';
import { ModelParams }			from './ModelParams';
import { ModelStatics }			from './ModelStatics';
import { ModelTestStats }		from './ModelTestStats';
import { PredictionEvaluation } from './PredictionEvaluation';
import { SessionData }			from './SessionData';
import { Utils }				from './Utils';


class Grid {
	private _axisSetTraverser: AxisSetTraverser;
	private _epochStats!: EpochStats;
	private _gridOptions: GridOptions;
	private _timeStartBatch = 0;
	private _timeStartEpoch = 0;
	private _timeStartGrid = 0;
	private _timeStartIteration = 0;

	constructor(axisSet: AxisSet,
				private _modelStatics: ModelStatics,
				private _sessionData: SessionData,
				private _callbackEvaluatePrediction: CallbackEvaluatePrediction,
				private _userGridOptions?: GridOptions,
				private _callbackReportIteration?: CallbackReportIteration,
				private _callbackReportEpoch?: CallbackReportEpoch,
				private _callbackReportBatch?: CallbackReportBatch) {

		console.log('\n' + 'Instantiating Grid...');

		// take the user's options block, if supplied, otherwise setup defaults
		if (!this._userGridOptions) {
			this._gridOptions = new GridOptions();
		}
		else {
			this._gridOptions = this._userGridOptions;
		}

		this._axisSetTraverser = new AxisSetTraverser(axisSet);

		// prune (and warn about) any model params that are pre-empted by a dynamic axis
		this.ResolveModelDefinition();
	}

	CreateModel(modelParams: ModelParams): TENSOR_FLOW.Sequential {
		const TOTAL_INPUT_NEURONS = this._sessionData.totalInputNeurons;
		const TOTAL_OUTPUT_NEURONS = this._sessionData.totalOutputNeurons;

		const TOTAL_HIDDEN_LAYERS = modelParams.GetNumericParam(Axis.AxisNames.LAYERS);

		const TF_MODEL = TENSOR_FLOW.sequential();

		if (TOTAL_HIDDEN_LAYERS === 0) {
			// this network goes directly from input to output, e.g. single layer perceptron
			TF_MODEL.add(TENSOR_FLOW.layers.dense(	{
														inputShape: [TOTAL_INPUT_NEURONS],
														units: TOTAL_OUTPUT_NEURONS,
														activation: modelParams.GetTextParam('activationOutput') as ActivationIdentifier, //HARD-CODER; TODO: Add this key as a managed Axis.
														useBias: true,
														kernelInitializer: this._modelStatics.GenerateInitializerKernel(),
														biasInitializer: this._modelStatics.GenerateInitializerBias()
													}));
		}
		else {
			// add the first hidden layer, which takes the inputs (TF has no discrete 'input layer')
			TF_MODEL.add(TENSOR_FLOW.layers.dense(	{
														inputShape: [TOTAL_INPUT_NEURONS],
														units: modelParams.GetNumericParam(Axis.AxisNames.NEURONS),
														activation: modelParams.GetTextParam('activationInput') as ActivationIdentifier, //HARD-CODER; TODO: Add this key as a managed Axis.
														useBias: true,
														kernelInitializer: this._modelStatics.GenerateInitializerKernel(),
														biasInitializer: this._modelStatics.GenerateInitializerBias()
													}));

			// add the remaining hidden layers; one-based, because of the built-in input layer
			for (let i = 1; i < TOTAL_HIDDEN_LAYERS; ++i) {
				TF_MODEL.add(TENSOR_FLOW.layers.dense(	{
															units: modelParams.GetNumericParam(Axis.AxisNames.NEURONS),
															activation: modelParams.GetTextParam('activationHidden') as ActivationIdentifier, //HARD-CODER; TODO: Add this key as a managed Axis.
															useBias: true,
															kernelInitializer: this._modelStatics.GenerateInitializerKernel(),
															biasInitializer: this._modelStatics.GenerateInitializerBias()
														}));
			}

			TF_MODEL.add(TENSOR_FLOW.layers.dense(	{
														units: TOTAL_OUTPUT_NEURONS,
														activation: modelParams.GetTextParam('activationOutput') as ActivationIdentifier, //HARD-CODER; TODO: Add this key as a managed Axis.
														useBias: true,
														biasInitializer: this._modelStatics.GenerateInitializerBias()
													}));
		}

//TODO: Print these, but only under a verbocity setting (way too spammy)
//		TF_MODEL.summary();

		const LEARNING_RATE = modelParams.GetNumericParam(Axis.AxisNames.LEARN_RATE);

		// compile the model, which prepares it for training
		TF_MODEL.compile(	{
								optimizer: this._modelStatics.GenerateOptimizer(LEARNING_RATE),
								loss: this._modelStatics.GenerateLossFunction(),
								metrics: 'accuracy'
							});

		return TF_MODEL;
	}

	ResetEpochStats(): void {
		console.assert(this._gridOptions.GetOption('epochStatsDepth') !== undefined);

//NOTE: This is currently only used by the reporting callback. It's contents, however, will be critical to tracking
//		overfit and stuck situations, as well as things like Smart Start(tm) (restarting unlucky iterations).

		const EPOCH_STATS_DEPTH = Number(this._gridOptions.GetOption('epochStatsDepth'));

		this._epochStats = new EpochStats(EPOCH_STATS_DEPTH);
	}

	async Run(): Promise<void> {
		const GRID_RUN_STATS = new GridRunStats();

		const TOTAL_ITERATIONS = this._axisSetTraverser.totalIterations;

		const TOTAL_REPETITIONS = Number(this._gridOptions.GetOption('repetitions'));

		const TOTAL_PASSES = TOTAL_ITERATIONS * TOTAL_REPETITIONS;

		let pass = 0;

		this._timeStartGrid = Date.now();

		for (let i = 0; !this._axisSetTraverser.traversed; ++i) {
			const DYNAMIC_PARAMS = this._axisSetTraverser.CreateIterationParams();

			const STATIC_PARAMS = this._modelStatics.ShallowCloneParams();

			const MODEL_PARAMS = new ModelParams(DYNAMIC_PARAMS, STATIC_PARAMS);

			for (let r = 0; r < TOTAL_REPETITIONS; ++r) {
				console.log('________________________________________________________________');
				console.log('Pass ' + (1 + pass) + '/' + TOTAL_PASSES
							+ ' (Iteration ' + (1 + i) + '/' + TOTAL_ITERATIONS
							+ ', Repetition ' + (1 + r) + '/' + TOTAL_REPETITIONS + ')'
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

				GRID_RUN_STATS.AddIterationResult(ITERATION_RESULT);
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
		console.log(GRID_RUN_STATS.WriteReport(true));

		const WRITE_RESULTS_OPTION = this._gridOptions.GetOption('writeResultsToDirectory');

		if (typeof WRITE_RESULTS_OPTION === 'string') {
			const FILENAME = FileIO.ProduceResultsFilename();

			await FileIO.WriteResultsFile(	FILENAME,
											WRITE_RESULTS_OPTION,
											GRID_RUN_STATS.WriteCSV());

//TODO: Look into Node's os/platform library. Gotta be a way to pull the appropriate slashes.
//		...and on the same pass, lookup and print the root directory.
			console.log('\n'
						+ 'Results file written as '
						+ (WRITE_RESULTS_OPTION === ''
							? './'
							: WRITE_RESULTS_OPTION + '/')
						+ FILENAME);
		}
	}

	ResolveModelDefinition(): void {
//NOTE: TODO: I'm not entirely happy with this. It feels like access breaking, to reach in via callback.
//			  It would be better to just produce a list of axis keys. That's all we want, anyway.
//			  ...will leave this on hold, pending the completion of the supported axes. There may be more
//			  to consider when it comes to complex axes like activator-schedules.

		// ensure the static and dynamic model parameters have no overlap, by stripping any dupes from the statics
		this._axisSetTraverser.ExamineAxisNames((axisKey: string) => {
			this._modelStatics.AttemptStripParam(axisKey);
		});
	}

//TODO: This model type might be too strict. Consider the lower-level TF LayersModel.
	TestModel(model: TENSOR_FLOW.Sequential, modelParams: ModelParams, duration: number): ModelTestStats {
		console.assert(model.built);
		console.assert(duration >= 0);

		console.log('Testing...');

//NOTE: This rule (limitation) is for the arraySync() done on PREDICTIONS_TENSOR.
//		"model.predict()" is dual mode. It outputs an array of Tensors when given an array of Tensors
//		as input. Our evaluation and scoring logic is not yet ready to support multiple ins/outs.
//TODO: ...but it will.
		if (!(this._sessionData.proofInputsTensor instanceof TENSOR_FLOW.Tensor)) {
			throw new Error('Invalid proof inputs; multi-input models are not yet supported.');
		}

		// run the unseen data through this trained model
		const PREDICTIONS_TENSOR = model.predict(	this._sessionData.proofInputsTensor,
													{
														batchSize: modelParams.GetNumericParam(Axis.AxisNames.BATCH_SIZE),
//NOTE: 'verbose' is not implemented as of TF 2.7.0. The documentation is wrong, but it's noted in the lib (see model.ts).
														verbose: false
													}) as TENSOR_FLOW.Tensor;

		// convert this TF Tensor into array form, for human-friendly analysis
		const PREDICTIONS: Types.ArrayOrder2 = PREDICTIONS_TENSOR.arraySync() as Types.ArrayOrder2;

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
			// send each targets-prediction pair to the user, for their scoring logic
			const EVALUATION: PredictionEvaluation = this._callbackEvaluatePrediction(PROOF_TARGETS[i], PREDICTIONS[i]);

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
	async TrainModel(model: TENSOR_FLOW.Sequential, modelParams: ModelParams): Promise<void> {
		console.assert(model.built);

		this.ResetEpochStats()

		const TOTAL_CASES = this._sessionData.totalTrainingCases;

//NOTE: ceil() is how TF performs this same split, as of v2.7.0.
		const TOTAL_VALIDATION_CASES = Math.ceil(TOTAL_CASES * modelParams.GetNumericParam(Axis.AxisNames.VALIDATION_SPLIT));

		const TOTAL_TRAINING_CASES = TOTAL_CASES - TOTAL_VALIDATION_CASES;

//NOTE: Cast this one. We know it exists, because we backfill any missing params. (TODO: Rewrite GridOptions vis-a-vis TS.)
		const USER_VALIDATION_SET_SIZE_MIN = this._gridOptions.GetOption('validationSetSizeMin') as number;

		if (TOTAL_VALIDATION_CASES <= USER_VALIDATION_SET_SIZE_MIN) {
			console.warn('Validation split is extremely low, and may not produce useful results.');
		}

		if (TOTAL_TRAINING_CASES <= USER_VALIDATION_SET_SIZE_MIN) {
			console.warn('Validation split is extremely high, and may not produce useful results.');
		}

		const TOTAL_EPOCHS = modelParams.GetNumericParam(Axis.AxisNames.EPOCHS);

		console.log('Training with ' + TOTAL_CASES + ' cases ('
					+ TOTAL_TRAINING_CASES + ' train, '
					+ TOTAL_VALIDATION_CASES + ' validate) '
					+ 'for ' + TOTAL_EPOCHS + ' epochs...');

		await model.fit(this._sessionData.trainingInputsTensor,
						this._sessionData.trainingTargetsTensor,
						{
							batchSize: modelParams.GetNumericParam(Axis.AxisNames.BATCH_SIZE),
							epochs: TOTAL_EPOCHS,
							shuffle: true,
//NOTE: As of 2020 11 23, tfjs-node logs an extra line per-epoch w/ verbosity 1+. It's redundant with our
//		default per-epoch line, thus the "0". However, it's worth keeping an eye on this for debugging.
							verbose: 0,
//NOTE: Validation is only performed if we provide this "validationSplit" arg. It's necessary to track overfit and stuck.
							validationSplit: modelParams.GetNumericParam(Axis.AxisNames.VALIDATION_SPLIT),
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

								onBatchEnd: (batch, logs) => {
									if (!this._callbackReportBatch) {
										return;
									}

//TODO: This is essentially duped by the Epoch handler (just below).
									const TIME_NOW = Date.now();

									const DURATION_BATCH = TIME_NOW - this._timeStartBatch;

									this._timeStartBatch = TIME_NOW;

									this._callbackReportBatch(DURATION_BATCH, batch, logs);
								},
								onEpochEnd: (epoch: number, logs) => {
									this._epochStats.Update(epoch, logs as TENSOR_FLOW.Logs);

//TODO: This is essentially duped by the Batch handler (just above).
									const TIME_NOW = Date.now();

									const DURATION_EPOCH = TIME_NOW - this._timeStartEpoch;

									this._timeStartEpoch = TIME_NOW;

									if (this._callbackReportEpoch) {
										this._callbackReportEpoch(DURATION_EPOCH, epoch, logs, this._epochStats);
										return;
									}

									if (epoch === 0) {
										console.log(EpochStats.WriteReportHeader());
									}

									console.log((1 + epoch) + '/' + TOTAL_EPOCHS, this._epochStats.WriteReport());
								}
							}
						});
	}
}

type CallbackEvaluatePrediction = (	target: Types.ArrayOrder1,
									prediction: Types.ArrayOrder1) => PredictionEvaluation;

type CallbackReportBatch = (duration: number,
							batch: number,
							logs: TENSOR_FLOW.Logs | undefined) => void;

type CallbackReportEpoch = (duration: number,
							epoch: number,
							logs: TENSOR_FLOW.Logs | undefined,
							epochStats: EpochStats) => void;

type CallbackReportIteration = (duration: number,
								predictions: Types.ArrayOrder2,
								proofInputs: Types.TFNestedArray,
								proofTargets: Types.ArrayOrder2) => void;

Object.freeze(Grid);

export { Grid };
