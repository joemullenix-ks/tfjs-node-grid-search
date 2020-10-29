'use strict';


const TENSOR_FLOW = require('@tensorflow/tfjs');


const { Axis } = require('./Axis');
const { AxisSet } = require('./AxisSet');
const { AxisSetTraverser } = require('./AxisSetTraverser');
const { ModelStatics } = require('./ModelStatics');
const { SessionData } = require('./SessionData');


class Grid {
	constructor(axisSet, modelStatics, sessionData) {
		console.assert(axisSet instanceof AxisSet);
		console.assert(modelStatics instanceof ModelStatics);
		console.assert(sessionData instanceof SessionData);

		this._modelStatics = modelStatics;
		this._sessionData = sessionData;

		this._axisSetTraverser = new AxisSetTraverser(axisSet);
	}

	CreateModel(dynamicParams) {
		console.assert(typeof dynamicParams === 'object');

/*
activationOutput:'softmax'
adamaxDecayRate:0.5
adamEnabled:true
adamLearnRate:0.001
batchSize:1
dropoutEnabled1stHidden:false
dropoutEnabled2ndHidden:false
dropoutRate:0.05
epochs:50
hiddenLayers:2
neuronsInput:15
neuronsOutput:5
neuronsPerHiddenLayer:3
standardizeInput:true
totalCases:100000
validationSplit:0.25
*/


//TASKS:
//	- lift these out as params:
//		bias
//		kernelInit
//		biasInit

		const TOTAL_INPUT_NEURONS = this._sessionData.GetTotalInputNeurons();
		const TOTAL_OUTPUT_NEURONS = this._sessionData.GetTotalOutputNeurons();

		const MODEL_PARAMS = this._modelStatics.CreateMergedClone(dynamicParams);

		const TOTAL_HIDDEN_LAYERS = MODEL_PARAMS[Axis.TYPE_NAME_LAYERS];

		const TF_MODEL = TENSOR_FLOW.sequential();

		if (TOTAL_HIDDEN_LAYERS === 0) {
			// this network goes directly from input to output, e.g. single layer perceptron
			TF_MODEL.add(TENSOR_FLOW.layers.dense(	{
														inputShape: [TOTAL_INPUT_NEURONS],
														units: TOTAL_OUTPUT_NEURONS,
														activation: MODEL_PARAMS.activationOutput,
														useBias: true,
														kernelInitializer: this._modelStatics.GenerateInitializerKernel(),
														biasInitializer: this._modelStatics.GenerateInitializerBias()
													}));
		}
		else {
			// add the first hidden layer, which takes the inputs (TF has no discrete 'input layer')
			TF_MODEL.add(TENSOR_FLOW.layers.dense(	{
														inputShape: [TOTAL_INPUT_NEURONS],
														units: MODEL_PARAMS[Axis.TYPE_NAME_NEURONS],
														activation: MODEL_PARAMS.activationInput,
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
															units: MODEL_PARAMS[Axis.TYPE_NAME_NEURONS],
															activation: MODEL_PARAMS.activationHidden,
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
														activation: MODEL_PARAMS.activationOutput,
//TODO: Add bias to the model options!
														useBias: true,
//TODO: UNTESTED: This was not part of the prototype. We had no init on the output bias (so it must have been zeroes).
														biasInitializer: this._modelStatics.GenerateInitializerBias()
													}));
		}

//TODO: Print these, but only under a verbocity setting (way too spammy)
//		TF_MODEL.summary();

		return TF_MODEL;
	}

	Run() {
// ! likely this is async; wait for each model pass; even offer up cancel-now? save-now? report-now?

		for (let iterations = 0; !this._axisSetTraverser.GetTraversed(); ++iterations) {
			console.log('Iteration ' + iterations + '\n' + this._axisSetTraverser.WriteReport());

//vvvv
			const DYNAMIC_PARAMS = this._axisSetTraverser.CreateIterationParams();

			const MODEL = this.CreateModel(DYNAMIC_PARAMS);

console.log('<< MODEL RUNS HERE >>');


//^^^^

			this._axisSetTraverser.Advance();
		}

console.log('<< GRID SEARCH DONE >>');

	}
}


Object.freeze(Grid);

exports.Grid = Grid;
