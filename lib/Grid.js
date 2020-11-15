'use strict';


//BUG: This require crashes (logged as https://github.com/tensorflow/tfjs/issues/4052):
//
//	const TENSOR_FLOW = require('@tensorflow/tfjs-node');
//
//NOTE: Confirmed that this file exists. However, building w/ tfjs-node reports module not found:
//	<project>\node_modules\@tensorflow\tfjs-node\lib\napi-v6
//	<project>\node_modules\@tensorflow\tfjs-node\lib\napi-v6\tfjs_binding.node


const TENSOR_FLOW = require('@tensorflow/tfjs');


const { Axis }					= require('./Axis');
const { AxisSet }				= require('./AxisSet');
const { AxisSetTraverser }		= require('./AxisSetTraverser');
const { EpochStats }			= require('./EpochStats');
const { GridOptions } = require('./GridOptions');
const { GridRunStats }			= require('./GridRunStats');
const { IterationResult }		= require('./IterationResult');
const { ModelParams }			= require('./ModelParams');
const { ModelStatics }			= require('./ModelStatics');
const { ModelTestStats }		= require('./ModelTestStats');
const { SessionData }			= require('./SessionData');
const { Utils }					= require('./Utils');


//TODO: Lift this out into an options {}; treat this as a default.
const EPOCH_TRAILING_AVERAGE_DEPTH = 5;


class Grid {
	constructor(axisSet,
				modelStatics,
				sessionData,
				callbackEvaluatePrediction,
				optionsPOD,
				callbackReportIteration,
				callbackReportEpoch,
				callbackReportBatch) {
		console.assert(axisSet instanceof AxisSet);
		console.assert(modelStatics instanceof ModelStatics);
		console.assert(sessionData instanceof SessionData);
		console.assert(typeof callbackEvaluatePrediction === 'function');

		// this class performs validation of optionsPOD and its contents
		this._gridOptions = new GridOptions(optionsPOD);

		if (callbackReportIteration !== undefined && callbackReportIteration !== null) {
			console.assert(typeof callbackReportIteration === 'function');

			this._callbackReportIteration = callbackReportIteration;
		}

		if (callbackReportEpoch !== undefined && callbackReportEpoch !== null) {
			console.assert(typeof callbackReportEpoch === 'function');

			this._callbackReportEpoch = callbackReportEpoch;
		}

		if (callbackReportBatch !== undefined && callbackReportBatch !== null) {
			console.assert(typeof callbackReportBatch === 'function');

			this._callbackReportBatch = callbackReportBatch;
		}

		this._callbackEvaluatePrediction = callbackEvaluatePrediction;
		this._modelStatics = modelStatics;
		this._sessionData = sessionData;

		this._axisSetTraverser = new AxisSetTraverser(axisSet);

		this._epochStats = null;
		this._gridRunStats = null;

		this._timeStartBatch = 0;
		this._timeStartEpoch = 0;
		this._timeStartGrid = 0;
		this._timeStartIteration = 0;
	}

	CreateModel(modelParams) {
		console.assert(modelParams instanceof ModelParams);

//TASKS:
//	- lift these out as params:
//		bias
//		kernelInit
//		biasInit
//		optimizer
//		loss function
//		?? standardizer

		const TOTAL_INPUT_NEURONS = this._sessionData.GetTotalInputNeurons();
		const TOTAL_OUTPUT_NEURONS = this._sessionData.GetTotalOutputNeurons();

		const TOTAL_HIDDEN_LAYERS = modelParams.GetParam(Axis.TYPE_NAME_LAYERS);

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
														units: modelParams.GetParam(Axis.TYPE_NAME_NEURONS),
														activation: modelParams.GetParam('activationInput'), //HARD-CODER; TODO: Add this as a managed Axis type, or define it ... somewhere.
														useBias: true,
														kernelInitializer: this._modelStatics.GenerateInitializerKernel(),
														biasInitializer: this._modelStatics.GenerateInitializerBias()
													}));

/*KEEP: dropouts are being rewritten
//NOTE: TODO: Read up on where these can go. Should we try to wedge it between the inputs and first-hidden??
			if (DROPOUT_ENABLED_1ST_HIDDEN) {
				TF_MODEL.add(TENSOR_FLOW.layers.dropout({ rate: DROPOUT_RATE }));
			}
*/

			// add the remaining hidden layers; one-based, because of the built-in input layer
			for (let i = 1; i < TOTAL_HIDDEN_LAYERS; ++i) {
				TF_MODEL.add(TENSOR_FLOW.layers.dense(	{
															units: modelParams.GetParam(Axis.TYPE_NAME_NEURONS),
															activation: modelParams.GetParam('activationHidden'), //HARD-CODER; TODO: Add this as a managed Axis type, or define it ... somewhere.
															useBias: true,
															kernelInitializer: this._modelStatics.GenerateInitializerKernel(),
															biasInitializer: this._modelStatics.GenerateInitializerBias()
														}));

/*KEEP: dropouts are being rewritten
//TODO: This becomes a A) add until cutoff system, or B) a passed-in schedule (although at that point why not hard-code the model)
				if (DROPOUT_ENABLED_2ND_HIDDEN && i <= 1) {
					TF_MODEL.add(TENSOR_FLOW.layers.dropout({ rate: DROPOUT_RATE }));
				}
*/
			}

			TF_MODEL.add(TENSOR_FLOW.layers.dense(	{
														units: TOTAL_OUTPUT_NEURONS,
														activation: modelParams.GetParam('activationOutput'), //HARD-CODER; TODO: Add this as a managed Axis type, or define it ... somewhere.
//TODO: Add bias to the model options!
														useBias: true,
//TODO: UNTESTED: This was not part of the prototype. We had no init on the output bias (so it must have been zeroes).
														biasInitializer: this._modelStatics.GenerateInitializerBias()
													}));
		}

//TODO: Print these, but only under a verbocity setting (way too spammy)
//		TF_MODEL.summary();

		// compile the model, which prepares it for training
		TF_MODEL.compile(	{
								optimizer: this._modelStatics.GenerateOptimizer(),
								loss: this._modelStatics.GenerateLossFunction(),
//TODO: Expose this one.
								metrics: 'accuracy'
								// metrics: ['accuracy', 'mse']
							});

		return TF_MODEL;
	}

	ResetEpochStats() {
//NOTE: This is currently only used by the reporting callback. It's contents, however, will be critical to tracking
//		overfit and stuck situations, as well as things like Smart Start(tm) (restarting unlucky iterations).
		this._epochStats = new EpochStats(EPOCH_TRAILING_AVERAGE_DEPTH);
	}

	async Run() {
		this._gridRunStats = new GridRunStats();

		const TOTAL_ITERATIONS = this._axisSetTraverser.totalIterations;

		const TOTAL_PASSES = TOTAL_ITERATIONS * this._gridOptions.repetitions;

		let pass = 0;

		this._timeStartGrid = Date.now();

		for (let i = 0; !this._axisSetTraverser.GetTraversed(); ++i) {
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

				// reset these, so the first report of each is accurate (essentially)
				this._timeStartBatch = this._timeStartIteration;
				this._timeStartEpoch = this._timeStartIteration;

				const MODEL = this.CreateModel(MODEL_PARAMS);

				await this.TrainModel(MODEL, MODEL_PARAMS);

				const MODEL_TEST_STATS = this.TestModel(MODEL, MODEL_PARAMS, Date.now() - this._timeStartIteration);

				const ITERATION_RESULT = new IterationResult(	i,
																this._axisSetTraverser.LookupIterationDescriptor(i),
																MODEL_PARAMS,
																MODEL_TEST_STATS,
																r);

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

//TODO: We might want a more human-friendly timestamp. We'd need to use localeString, and clean it up for file-system
//		compatibility; totally doable.
//		We might prefer to offer a user-provided filename prefix, in the _gridOptions block.
//		...pending beta feedback.
			const FILENAME = 'Results_' + Date.now() + '.csv';

			await FileIO.WriteResultsFile(	FILENAME,
											this._gridOptions.writeResultsToDirectory,
											this._gridRunStats.WriteCSV(),
											RESULT);

//TODO: Look into Node's os/platform library. Gotta be a way to pull the appropriate slashes.
//		...and on the same pass, lookup the root directory.
			console.log('\n'
						+ 'Results file written as '
						+ (this._gridOptions.writeResultsToDirectory === ''
							? './'
							: this._gridOptions.writeResultsToDirectory + '/')
						+ FILENAME);
		}
	}

	TestModel(model, modelParams, duration) {
		console.assert(model instanceof TENSOR_FLOW.Sequential); //TODO: This might be too strict; consider the lower level LayersModel
		console.assert(model.built);
		console.assert(modelParams instanceof ModelParams);
		console.assert(typeof duration === 'number');
		console.assert(duration >= 0);
		console.assert(Math.floor(duration) === duration);

		console.log('Testing...');

		// run the unseen data through this trained model
		const PREDICTIONS_TENSOR = model.predict(	this._sessionData.GetProofInputsTensor(),
													{
														batchSize: modelParams.GetParam(Axis.TYPE_NAME_BATCH_SIZE),
//NOTE: 'verbose' is not implemented as of TF 2.7.0. The documentation is wrong, but it's noted in the lib (see model.ts).
														verbose: false
													});

		// convert this TF Tensor into array form, for human-friendly analysis
		const PREDICTIONS = PREDICTIONS_TENSOR.arraySync();

		// pull the unstandardized proof cases (again, for the human-friendly report)

		const PROOF_INPUTS = this._sessionData.GetRawProofInputs();

		const PROOF_TARGETS = this._sessionData.GetProofTargets();

		console.assert(PROOF_TARGETS.length === PREDICTIONS.length); // sanity-check

		if (this._callbackReportIteration !== undefined) {
			this._callbackReportIteration(duration, PREDICTIONS, PROOF_INPUTS, PROOF_TARGETS);
		}

		// we now 'score' the predictions by tallying the responses from the user's callback

		let aggregateDeltaCorrect = 0.0;
		let aggregateDeltaIncorrect = 0.0;

		let totalCorrect = 0;

		for (let i = 0; i < PREDICTIONS.length; ++i) {
			const EVALUATION = this._callbackEvaluatePrediction(PROOF_TARGETS[i], PREDICTIONS[i]);

			// enforce the required response format; TODO: Make a simple class for this

			if (typeof EVALUATION !== 'object') {
				throw new Error('"callbackEvaluatePrediction" must return an object. Received type ' + typeof EVALUATION);
			}

			if (   typeof EVALUATION.correct !== 'boolean'
				|| typeof EVALUATION.delta !== 'number') {
				throw new Error('"callbackEvaluatePrediction" response invalid. The returned object must have the '
								+ 'following proerties:' + '\n'
								+ 'correct: <boolean>' + '\n'
								+ 'delta: <number>');
			}

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

	async TrainModel(model, modelParams) {
		console.assert(model instanceof TENSOR_FLOW.Sequential);
		console.assert(modelParams instanceof ModelParams);

		this.ResetEpochStats()

		console.log('Training...');

		const TOTAL_EPOCHS = modelParams.GetParam(Axis.TYPE_NAME_EPOCHS);

		await model.fit(this._sessionData.GetTrainingInputs(),
						this._sessionData.GetTrainingTargets(),
						{
							batchSize: modelParams.GetParam(Axis.TYPE_NAME_BATCH_SIZE),
							epochs: TOTAL_EPOCHS,
							shuffle: true,
							verbose: 2,
//NOTE: Validation is only performed if we provide this "validationSplit" arg. It's necessary to track overfit and stuck.
							validationSplit: modelParams.GetParam(Axis.TYPE_NAME_VALIDATION_SPLIT),
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
//TODO: This is essentially duped by the Epoch handler (just below).
									if (this._callbackReportBatch === undefined) {
										return;
									}

									const TIME_NOW = Date.now();

									const DURATION = TIME_NOW - this._timeStartGrid;

									const DURATION_BATCH = TIME_NOW - this._timeStartBatch;

									this._timeStartBatch = TIME_NOW;

									this._callbackReportBatch(DURATION_BATCH, batch, logs);
								},
								onEpochEnd: (epoch, logs) => {
									this._epochStats.Update(epoch, logs);

									const TIME_NOW = Date.now();

									const DURATION = TIME_NOW - this._timeStartGrid;

									const DURATION_EPOCH = TIME_NOW - this._timeStartEpoch;

									this._timeStartEpoch = TIME_NOW;

									if (this._callbackReportEpoch === undefined) {
										if (epoch === 0) {
											console.log(EpochStats.ReportGuide);
										}

										console.log((1 + epoch) + '/' + TOTAL_EPOCHS,
													this._epochStats.WriteReport());

										return;
									}

									this._callbackReportEpoch(DURATION_EPOCH, epoch, logs, this._epochStats);
								}
							}
						});
	}
}


Object.freeze(Grid);

exports.Grid = Grid;
