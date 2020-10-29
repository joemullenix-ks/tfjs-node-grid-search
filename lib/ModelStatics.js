'use strict';


const TENSOR_FLOW = require('@tensorflow/tfjs');

const { Axis } = require('./Axis');
const { AxisSet } = require('./AxisSet');


class ModelStatics {
	constructor(axisSet, params) {
		console.assert(axisSet instanceof AxisSet);
		console.assert(typeof params === 'object'); //NOTE: This model-settings block is Plain Old Data.

		// validate the user-supplied model params

//TODO: Abstract this error object into a class (or merge in the 'f' libs).
		const VALIDATION_ERROR = {message: ''};

		for (let k in params) {
			if (!ModelStatics.AttemptValidateParameter(k, params[k], VALIDATION_ERROR)) {
				// fatal, so that users don't kick off a (potentially very long) grid search with a bad model config
				throw new Error('There was a problem with the model params.' + '\n' + VALIDATION_ERROR.message);
			}
		}

		// the axes and param arguments are valid

		// setup the static model params, i.e. those params that never change from iteration to iteration

		this._staticParams = {};

		this.WriteStaticParams(params);

//vvvv WORK IN PROGRESS: Tack on the NOT-YET-SUPPORTED axes

//NOTE: TODO: The primary goal of this project is to support as many of these as axes, in as many ways as possible (progressions,
//			  custom schedules, randomizers, smart systems, ... ?).
//
//TODO: Support dynamic initializers and activations, although some of them take params, and will have to be done via callback.

		// axes next-in-line to be supported

		const ACTIVATION_DEFAULT = 'relu'; //'elu'|'hardsigmoid'|'linear'|'relu'|'relu6'| 'selu'|'sigmoid'|'softmax'|'softplus'|'softsign'|'tanh'

		this._staticParams.activationHidden = ACTIVATION_DEFAULT;
		this._staticParams.activationInput = ACTIVATION_DEFAULT;
		this._staticParams.activationOutput = 'softmax';
		// this._staticParams.adamEnabled = true; // as opposed to Adamax
		// this._staticParams.adamaxDecayRate = 0.5;
		this._staticParams.dropoutEnabled1stHidden = false; // would be input layer, but for built-in inputs ><
		this._staticParams.dropoutEnabled2ndHidden = false;
		this._staticParams.dropoutRate = 0.05;
		this._staticParams.totalCases = 100 * 1000; // this should come from the data
		this._staticParams.batchSize = 1;
		this._staticParams.validationSplit = 0.25; // this % is not trained upon by fit()
		// this._staticParams.adamLearnRate = 0.001;
		this._staticParams.epochs = 50;
		this._staticParams.standardizeInput = true; // to mean zero, variance one

		// axes to be supported, eventually
// ??

		// potentially supported axes, but maybe never because they belong at a higher scope
// ??

//^^^^

		// prune (and warn about) any model params that are pre-empted by a dynamic axis
		this.StripParametersPreemptedByAxes(axisSet);
	}

	CreateMergedClone(dynamicParams) {
		console.assert(typeof dynamicParams === 'object');

		const PARAMS_SHALLOW_CLONE = Object.assign({}, this._staticParams);

		// add the dynamic params to this clone
		for (let k in dynamicParams) {
			if (PARAMS_SHALLOW_CLONE[k] !== undefined) {
				throw new Error('invalid merge; model statics has a key provided by the dynamic params: ' + k);
			}

			PARAMS_SHALLOW_CLONE[k] = dynamicParams[k];
		}

		return PARAMS_SHALLOW_CLONE;
	}

	GenerateInitializerBias() {
//NOTE: See https://js.tensorflow.org/api/2.7.0/#class:initializers.Initializer
		return TENSOR_FLOW.initializers.constant({value: 0.1});
	}

	GenerateInitializerKernel() {
//NOTE: See https://js.tensorflow.org/api/2.7.0/#class:initializers.Initializer
		return TENSOR_FLOW.initializers.heNormal({seed: Math.random()});
	}

	GenerateLossFunction() {
//NOTE: See https://js.tensorflow.org/api/2.7.0/#tf.LayersModel.compile
		return 'categoricalCrossentropy';
	}

	GenerateOptimizer() {
//NOTE: See https://js.tensorflow.org/api/2.7.0/#tf.LayersModel.compile
		return TENSOR_FLOW.train.adam();
	}

	StripParametersPreemptedByAxes(axisSet) {
		console.assert(axisSet instanceof AxisSet);

		// Remove params supplied by the user but overridden, i.e. not a static part of model. They're redundant, but not fatal.
		axisSet.Walk((axis) => {
			const AXIS_KEY = axis.GetTypeName();

			if (this._staticParams[AXIS_KEY] !== undefined) {
				console.warn('"' + AXIS_KEY + '" is managed by a dynamic grid axis. The static model param will be ignored.');

				delete this._staticParams[AXIS_KEY];
			}
		});

	}

	WriteStaticParams(params) {
//NOTE: We write these to the object root, so that the keys are never duplicated. This costs us the underscore convention.

		// set the user's value, or take the program default (every param is optional)

		if (params[Axis.TYPE_NAME_NEURONS] !== undefined) {
			this._staticParams[Axis.TYPE_NAME_NEURONS] = params[Axis.TYPE_NAME_NEURONS];
		}
		else {
			this._staticParams[Axis.TYPE_NAME_NEURONS] = Axis.TYPE_DEFAULT_NEURONS;
		}

//keep: but DOOMed as we plan to rewrite the layer system (with implied support for zero-hidden)
//		// (v as part of the layers axis, this one)
//		this._singleLayerOverride = false; // this renders layer and neuron counts meaningless; needs only input and output counts

		if (params[Axis.TYPE_NAME_LAYERS] !== undefined) {
			this._staticParams[Axis.TYPE_NAME_LAYERS] = params[Axis.TYPE_NAME_LAYERS];
		}
		else {
			this._staticParams[Axis.TYPE_NAME_LAYERS] = Axis.TYPE_DEFAULT_LAYERS;
		}
	}
}


ModelStatics.ERROR_TEXT_NON_NEGATIVE_INTEGER	= 'The value must be a non-negative integer.';
ModelStatics.ERROR_TEXT_PARAM_UNKNOWN			= 'The parameter is not recognized.';
ModelStatics.ERROR_TEXT_POSITIVE_INTEGER		= 'The value must a positive integer.';


//NOTE: Exposing this static method, on the assumption outside scopes might want to validate model params.
//
//NOTE: There is an argument for moving this into Axis.
ModelStatics.AttemptValidateParameter = (key, value, errorData) => {
	console.assert(typeof errorData === 'object');
	console.assert(errorData.message !== undefined);

//NOTE: It's important to gracefully handle bad inputs here, with explanations and recommendations in the failure text.
//		This has the potential to be a point-of-failure for new users ramping up on model config.

	let errorSuffix = '';

	switch (key) {
		case Axis.TYPE_NAME_LAYERS: {
			if (CHECK_NON_NEGATIVE_INTEGER(value)) {
				return true;
			}

			errorSuffix = ModelStatics.ERROR_TEXT_NON_NEGATIVE_INTEGER;
		}
		break;

		case Axis.TYPE_NAME_NEURONS: {
			if (CHECK_POSITIVE_INTEGER(value)) {
				return true;
			}

			errorSuffix = ModelStatics.ERROR_TEXT_POSITIVE_INTEGER;
		}
		break;

		case '': {

		}
		break;

		case '': {

		}
		break;

		case '': {

		}
		break;

		case '': {

		}
		break;

		case '': {

		}
		break;

		case '': {

		}
		break;

		case '': {

		}
		break;

		default: {
			errorSuffix = ModelStatics.ERROR_TEXT_PARAM_UNKNOWN;
		}
	}

	errorData.message = '"' + key + '" is not valid. ' + errorSuffix;

	return false;
};


const CHECK_NON_NEGATIVE_INTEGER = (x) => {
	if (typeof x !== 'number') {
		return false;
	}

	if (x < 0) {
		return false;
	}

	if (x !== Math.floor(x)) {
		return false;
	}

	return true;
};

const CHECK_POSITIVE_INTEGER = (x) => {
	if (!CHECK_NON_NEGATIVE_INTEGER(x)) {
		return false;
	}

	if (x < 1) {
		return false;
	}

	return true;
};

/*DOOM: now a member
const STRIP_PARAMETERS_PREEMTED_BY_AXES = (axisSet, params) => {
	// Remove params supplied by the user but overridden, i.e. not a static part of model. They're redundant, but not fatal.
	for (let k in params) {
		axisSet.Walk((axis) => {
			if (Axis.LookupTypeName(axis._typeEnum) === k) {
				console.warn('"' + k + '" is managed by a dynamic grid axis. The static model param will be ignored.');

				delete params[k];
			}
		});
	}
};
*/


Object.freeze(ModelStatics);

exports.ModelStatics = ModelStatics;
