'use strict';


//BUG: const TENSOR_FLOW = require('@tensorflow/tfjs-node');
//
//NOTE: Confirmed that this file exists. However, building w/ tfjs-node reports module not found:
//	C:\Users\joeku\OneDrive\_junk\ks\territoriaTFNodeFFS\node_modules\@tensorflow\tfjs-node\lib\napi-v6
//	C:\Users\joeku\OneDrive\_junk\ks\territoriaTFNodeFFS\node_modules\@tensorflow\tfjs-node\lib\napi-v6\tfjs_binding.node


const SIMPLE_STATISTICS		= require('simple-statistics');
const TENSOR_FLOW			= require('@tensorflow/tfjs');


const { Axis }					= require('./Axis');
const { AxisSet }				= require('./AxisSet');
const { AxisSetTraverser }		= require('./AxisSetTraverser');
const { ModelStatics }			= require('./ModelStatics');
const { SessionData }			= require('./SessionData');


class Grid {
	constructor(axisSet, modelStatics, sessionData) {
		console.assert(axisSet instanceof AxisSet);
		console.assert(modelStatics instanceof ModelStatics);
		console.assert(sessionData instanceof SessionData);

		this._modelStatics = modelStatics;
		this._sessionData = sessionData;

		this._axisSetTraverser = new AxisSetTraverser(axisSet);

		this._timeStart = Date.now();

		this._timePreviousEpoch = this._timeStart;
	}

	CreateModel(modelParams) {
		console.assert(typeof modelParams === 'object');

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

		const TOTAL_HIDDEN_LAYERS = modelParams[Axis.TYPE_NAME_LAYERS];

		const TF_MODEL = TENSOR_FLOW.sequential();

		if (TOTAL_HIDDEN_LAYERS === 0) {
			// this network goes directly from input to output, e.g. single layer perceptron
			TF_MODEL.add(TENSOR_FLOW.layers.dense(	{
														inputShape: [TOTAL_INPUT_NEURONS],
														units: TOTAL_OUTPUT_NEURONS,
														activation: modelParams.activationOutput,
														useBias: true,
														kernelInitializer: this._modelStatics.GenerateInitializerKernel(),
														biasInitializer: this._modelStatics.GenerateInitializerBias()
													}));
		}
		else {
			// add the first hidden layer, which takes the inputs (TF has no discrete 'input layer')
			TF_MODEL.add(TENSOR_FLOW.layers.dense(	{
														inputShape: [TOTAL_INPUT_NEURONS],
														units: modelParams[Axis.TYPE_NAME_NEURONS],
														activation: modelParams.activationInput,
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
															units: modelParams[Axis.TYPE_NAME_NEURONS],
															activation: modelParams.activationHidden,
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
														activation: modelParams.activationOutput,
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

	async Run() {
		for (let iterations = 0; !this._axisSetTraverser.GetTraversed(); ++iterations) {
			console.log('Iteration ' + iterations + '\n' + this._axisSetTraverser.WriteReport());

			const DYNAMIC_PARAMS = this._axisSetTraverser.CreateIterationParams();

			const MODEL_PARAMS = this._modelStatics.CreateMergedClone(DYNAMIC_PARAMS);

			const MODEL = this.CreateModel(MODEL_PARAMS);

			await this.TrainModel(MODEL, MODEL_PARAMS);

			this._axisSetTraverser.Advance();
		}

		console.log('<< GRID SEARCH DONE >>');
	}

	async TrainModel(model, modelParams) {
		console.assert(typeof model === 'object');
		console.assert(model instanceof TENSOR_FLOW.Sequential);
		console.assert(typeof modelParams === 'object');



const TRAIL_COUNT_LONG = 5;

const TRAIL_ACC_LONG = new Array();
const TRAIL_LOSS_LONG = new Array();
const TRAIL_VAL_ACC_LONG = new Array();
const TRAIL_VAL_LOSS_LONG = new Array();



		await model.fit(this._sessionData.GetTrainingInputs(),
						this._sessionData.GetTrainingTargets(),
						{
							batchSize: modelParams.batchSize,
							epochs: modelParams.epochs,
							shuffle: true,
							verbose: 2,
//NOTE: Looks like no validation is done w/o this "validationSplit" arg. Also,
//		 any validation is purely informative, e.g. to track overfit or stuck.
							validationSplit: modelParams.validationSplit,
							callbacks:
							{
//v vv QUICK TRIAL FOR SUPER-LONG RUNS
								onBatchEnd: (batch, logs) => {
/*KEEP: This comes back as part of a reporting module.
									if (!REPORT_BATCHES) {
										return;
									}

									if (batch % 1000 !== 0) {
										return;
									}

									let textOut = ''

									for (let k in logs) {
										textOut += k + ' ' + logs[k].toFixed(5) + ', ';
									}

									console.log(textOut);

									//KEEP: WTF this doesn't work no idea
									// console.log('batch: ' + batch
									// 			+ ', loss: ' + logs.loss.toFixed(5)
									// 			+ ', acc: ' + logs.acc.toFixed(5)
									// 			+ ', mse: ' + loss.mse.toFixed(5) );
*/
								},
//^ ^^
								// onEpochEnd: (epoch, logs) => { console.log('onEpochEnd', epoch, logs); },
								onEpochEnd: (epoch, logs) => {

const DIGITS_LONG = 4;
const DIGITS_SLOPE = 6;

									const AVE_ACC_LONG			= ROTATE_SAMPLE(TRAIL_ACC_LONG, logs.acc, TRAIL_COUNT_LONG);
									const AVE_LOSS_LONG			= ROTATE_SAMPLE(TRAIL_LOSS_LONG, logs.loss, TRAIL_COUNT_LONG);
									const AVE_VAL_ACC_LONG		= ROTATE_SAMPLE(TRAIL_VAL_ACC_LONG, logs.val_acc, TRAIL_COUNT_LONG);
									const AVE_VAL_LOSS_LONG		= ROTATE_SAMPLE(TRAIL_VAL_LOSS_LONG, logs.val_loss, TRAIL_COUNT_LONG);

									const DURATION = Date.now() - this._timeStart;

									const DURATION_EPOCH = Date.now() - this._timePreviousEpoch;

									this._timePreviousEpoch = Date.now();

									const TRAIL_ACC_LONG_AS_COORDS = TRAIL_ACC_LONG.map((value, index) => {return [index, value];});
									const TRAIL_LOSS_LONG_AS_COORDS = TRAIL_LOSS_LONG.map((value, index) => {return [index, value];});
									const TRAIL_VAL_ACC_LONG_AS_COORDS = TRAIL_VAL_ACC_LONG.map((value, index) => {return [index, value];});
									const TRAIL_VAL_LOSS_LONG_AS_COORDS = TRAIL_VAL_LOSS_LONG.map((value, index) => {return [index, value];});

									const LINE_ACC_LONG = SIMPLE_STATISTICS.linearRegression(TRAIL_ACC_LONG_AS_COORDS);
									const LINE_LOSS_LONG = SIMPLE_STATISTICS.linearRegression(TRAIL_LOSS_LONG_AS_COORDS);
									const LINE_VAL_ACC_LONG = SIMPLE_STATISTICS.linearRegression(TRAIL_VAL_ACC_LONG_AS_COORDS);
									const LINE_VAL_LOSS_LONG = SIMPLE_STATISTICS.linearRegression(TRAIL_VAL_LOSS_LONG_AS_COORDS);

									const ACC_DELTA = AVE_LOSS_LONG - AVE_VAL_LOSS_LONG;

									console.log(epoch,
												'LOSS:', AVE_LOSS_LONG.toFixed(DIGITS_LONG),
													'(' + AVE_VAL_LOSS_LONG.toFixed(DIGITS_LONG) + ')',
													'd' + (ACC_DELTA < 0 ? '' : ' ' ) + ACC_DELTA.toFixed(2) + ',',
												'slope:', (LINE_LOSS_LONG.m < 0 ? '' : ' ' ) + LINE_LOSS_LONG.m.toFixed(DIGITS_SLOPE),
													'(' + (LINE_VAL_LOSS_LONG.m < 0 ? '' : ' ' ) + LINE_VAL_LOSS_LONG.m.toFixed(DIGITS_SLOPE) + ')',
												'|| ACC:', AVE_ACC_LONG.toFixed(DIGITS_LONG),
														'(' + AVE_VAL_ACC_LONG.toFixed(DIGITS_LONG) + '),',
												'slope:', (LINE_ACC_LONG.m < 0 ? '' : ' ' ) + LINE_ACC_LONG.m.toFixed(DIGITS_SLOPE),
													'(' + (LINE_VAL_ACC_LONG.m < 0 ? '' : ' ' ) + LINE_VAL_ACC_LONG.m.toFixed(DIGITS_SLOPE) + ')',
												'DUR: ' + (DURATION_EPOCH / 60 / 1000).toFixed(2) + ' mins |',
															(DURATION / 60 / 60 / 1000).toFixed(1) + ' hrs');
								},
								// onTrainBegin: (logs) => { console.log('onTrainBegin', logs); },
								// onTrainEnd: (logs) => { console.log('onTrainEnd', logs); },
								// onEpochBegin: (epoch, logs) => { console.log('onEpochBegin', epoch, logs); },
								// onEpochEnd: (epoch, logs) => { console.log('onEpochEnd', epoch, logs); },
								// onBatchBegin: (batch, logs) => { console.log('onBatchBegin', batch, logs); },
								// onBatchEnd: (batch, logs) => { console.log('onBatchEnd', batch, logs); },
								// onYield: (epoch, batch, logs) => { console.log('onYield', epoch, batch, logs); }
							}
						});
	}
}


//TODO: This moves into a reporting module.
const ROTATE_SAMPLE = (arr, x, count) => {
	arr.push(x);

	if (arr.length > count) {
		arr.shift();
	}

	const SUM = arr.reduce((prev, curr) => {return prev + curr}, 0);

	return SUM / arr.length;
};


Object.freeze(Grid);

exports.Grid = Grid;
