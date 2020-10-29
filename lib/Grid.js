'use strict';


const { Axis } = require('./Axis');
const { AxisSet } = require('./AxisSet');
const { AxisSetTraverser } = require('./AxisSetTraverser');
const { ModelStatics } = require('./ModelStatics');
const { SessionData } = require('./SessionData');


/*WORKING: TEMP: The design for these is pending; certainly not like this (or here; likely ModelStatics)*/
const GENERATE_INITIALIZER_BIAS = () => {		// DEFAULT: zeroes
	return tf.initializers.constant({value: 0.1});
};

const GENERATE_INITIALIZER_KERNEL = () => {		// DEFAULT: glorotNormal
	return tf.initializers.heNormal({seed: Math.random()});
};

const GENERATE_ACTIVATOR_TEST = () => {
	return function leakyRelu(x, epsilon) {
		return tf.tidy(() => {
			const min = tf.mul(x, tf.scalar(epsilon))
				return tf.maximum(x, min)
		})
	}
};
/**/


class Grid {
	constructor(axisSet, modelStatics, sessionData, tensorFlow) {
		console.assert(axisSet instanceof AxisSet);
		console.assert(modelStatics instanceof ModelStatics);
		console.assert(sessionData instanceof SessionData);


/*??*/	console.assert(typeof tensorFlow === 'object');


		this._modelStatics = modelStatics;
		this._sessionData = sessionData;
		this._tensorFlow = tensorFlow;

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
proofPercentage:0.001
standardizeInput:true
totalCases:100000
validationSplit:0.25
*/


//TASKS:
//	- lift these out as params:
//		bias
//		kernelInit
//		biasInit

		const TOTAL_INPUT_NEURONS = this._sessionData.CalculateInputNeurons();
		const TOTAL_OUTPUT_NEURONS = this._sessionData.CalculateOutputNeurons();

		const MODEL_PARAMS = this._modelStatics.CreateMergedClone(dynamicParams);

		const TOTAL_HIDDEN_LAYERS = MODEL_PARAMS[Axis.TYPE_NAME_LAYERS];

		const TF_MODEL = this._tensorFlow.sequential();

		if (TOTAL_HIDDEN_LAYERS === 0) {
			// this network goes directly from input to output, e.g. single layer perceptron
			TF_MODEL.add(this._tensorFlow.layers.dense(	{
															inputShape: [TOTAL_INPUT_NEURONS],
															units: TOTAL_OUTPUT_NEURONS,
															activation: MODEL_PARAMS.activationOutput,
															useBias: true,
															kernelInitializer: GENERATE_INITIALIZER_KERNEL(),
															biasInitializer: GENERATE_INITIALIZER_BIAS(),
														}));
		}
		else {
			// add the first hidden layer, which takes the inputs (TF has no discrete 'input layer')
			TF_MODEL.add(this._tensorFlow.layers.dense(	{
															inputShape: [TOTAL_INPUT_NEURONS],
															units: MODEL_PARAMS[Axis.TYPE_NAME_NEURONS],
															activation: MODEL_PARAMS.activationInput,
															useBias: true,
															kernelInitializer: GENERATE_INITIALIZER_KERNEL(),
															biasInitializer: GENERATE_INITIALIZER_BIAS(),
														}));

/*KEEP: dropouts are being rewritten
//NOTE: TODO: Read up on where these can go. Should we try to wedge it between the inputs and first-hidden??
			if (DROPOUT_ENABLED_1ST_HIDDEN) {
				TF_MODEL.add(this._tensorFlow.layers.dropout({ rate: DROPOUT_RATE }));
			}
*/

			// add the remaining hidden layers; one-based, because of the built-in input layer
			for (let i = 1; i < TOTAL_HIDDEN_LAYERS; ++i) {
				TF_MODEL.add(this._tensorFlow.layers.dense(	{
																units: MODEL_PARAMS[Axis.TYPE_NAME_NEURONS],
																activation: MODEL_PARAMS.activationHidden,
																useBias: true,
																kernelInitializer: GENERATE_INITIALIZER_KERNEL(),
																biasInitializer: GENERATE_INITIALIZER_BIAS(),
															}));

/*KEEP: dropouts are being rewritten
//TODO: This becomes a A) add until cutoff system, or B) a passed-in schedule (although at that point why not hard-code the model)
				if (DROPOUT_ENABLED_2ND_HIDDEN && i <= 1) {
					TF_MODEL.add(this._tensorFlow.layers.dropout({ rate: DROPOUT_RATE }));
				}
*/
			}

			TF_MODEL.add(this._tensorFlow.layers.dense(	{
															units: TOTAL_OUTPUT_NEURONS,
															activation: MODEL_PARAMS.activationOutput,
															useBias: true
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
console.log('<< MODEL RUNS HERE >>');

			const DYNAMIC_PARAMS = this._axisSetTraverser.CreateIterationParams();

			const MODEL = this.CreateModel(DYNAMIC_PARAMS);
//^^^^

			this._axisSetTraverser.Advance();
		}

console.log('<< GRID SEARCH DONE >>');

	}
}


Object.freeze(Grid);

exports.Grid = Grid;
