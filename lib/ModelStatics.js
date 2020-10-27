'use strict';


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

		// these arguments are valid

		// setup the static model params, i.e. those that never change from iteration to iteration
		this.WriteStatics(params);

//vvvv WORK IN PROGRESS: Tack on the NOT-YET-SUPPORTED axes

//NOTE: TODO: The primary goal of this project is to support as many of these as axes, in as many ways as possible (progressions,
//			  custom schedules, randomizers, smart systems, ... ?).

		// axes next-in-line to be supported
		const ACTIVATION_DEFAULT = 'relu'; //'elu'|'hardsigmoid'|'linear'|'relu'|'relu6'| 'selu'|'sigmoid'|'softmax'|'softplus'|'softsign'|'tanh'
		this.activationHidden = ACTIVATION_DEFAULT;
		this.activationInput = ACTIVATION_DEFAULT;
		this.activationOutput = 'softmax';
		this.adamEnabled = true; // as opposed to Adamax
		this.adamaxDecayRate = 0.5;
		this.dropoutEnabled1stHidden = false; // would be input layer, but for built-in inputs ><
		this.dropoutEnabled2ndHidden = false;
		this.dropoutRate = 0.05;
		this.totalCases = 100 * 1000; // this should come from the data
		this.batchSize = 1;

		console.assert(Math.floor(this.totalCases / this.batchSize)
						=== this.totalCases / this.batchSize); // even mult; doesn't really matter

		this.validationSplit = 0.25; // this % is not trained upon by fit()
		this.adamLearnRate = 0.001;
		this.epochs = 50;
		this.standardizeInput = true; // to mean zero, variance one

		// axes to be supported, eventually

		// set aside 100 or 10% (whichever is less) for post-training generalization tests
		this.proofPercentage = this.totalCases < 1000 ? 0.1 : (100 / this.totalCases); //TODO: consts for these, or a class

		// potentially supported axes, but maybe never because they belong at a higher scope
		this.neuronsInput = 15;
		this.neuronsOutput = 5;
//^^^^

		// prune (and warn about) any model params that are pre-empted by a dynamic axis
		STRIP_PARAMETERS_PREEMTED_BY_AXES(axisSet, params);
	}

	WriteStatics(params) {
//NOTE: We write these to the object root, so that the keys are never duplicated. This costs us the underscore convention.

		// set the user's value, or take the program default (every param is optional)

		if (params[Axis.TYPE_NAME_NEURONS] !== undefined) {
			this[Axis.TYPE_NAME_NEURONS] = params[Axis.TYPE_NAME_NEURONS];
		}
		else {
			this[Axis.TYPE_NAME_NEURONS] = Axis.TYPE_DEFAULT_NEURONS;
		}

//keep: but DOOMed as we plan to rewrite the layer system (with implied support for zero-hidden)
//		// (v as part of the layers axis, this one)
//		this._singleLayerOverride = false; // this renders layer and neuron counts meaningless; needs only input and output counts

		if (params[Axis.TYPE_NAME_LAYERS] !== undefined) {
			this[Axis.TYPE_NAME_LAYERS] = params[Axis.TYPE_NAME_LAYERS];
		}
		else {
			this[Axis.TYPE_NAME_LAYERS] = Axis.TYPE_DEFAULT_LAYERS;
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


Object.freeze(ModelStatics);

exports.ModelStatics = ModelStatics;
