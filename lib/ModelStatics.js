'use strict';


const TENSOR_FLOW = require('@tensorflow/tfjs');


const { Axis }		= require('./Axis');
const { AxisSet }	= require('./AxisSet');
const { Utils }		= require('./Utils');


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

		// prune (and warn about) any model params that are pre-empted by a dynamic axis
		this.StripParametersPreemptedByAxes(axisSet, params);
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

	ShallowCloneParams() {
		return Object.assign({}, this._staticParams);
	}

	StripParametersPreemptedByAxes(axisSet, userStatics) {
		console.assert(axisSet instanceof AxisSet);
		console.assert(typeof userStatics === 'object');

		// ensure the static and dynamic model parameters have no overlap
		axisSet.Walk((axis) => {
			const AXIS_KEY = axis.GetTypeName();

			if (this._staticParams[AXIS_KEY] !== undefined) {
				// this static param will be dropped, because the user created a dynamic axis to manage it

				// if the user _also_ sent it as a static (which is allowed), warn them that we'll use their dynamic axis
				if (userStatics[AXIS_KEY] !== undefined) {
					console.warn('"' + AXIS_KEY + '" is managed by a dynamic grid axis. The static model param will be ignored.');
				}

				delete this._staticParams[AXIS_KEY];
			}
		});

	}

	WriteStaticParams(params) {
		console.assert(typeof params === 'object');

		// set the user's value, or take the program default (every param is optional)

		this._staticParams[Axis.TYPE_NAME_BATCH_SIZE] = params[Axis.TYPE_NAME_BATCH_SIZE] !== undefined
														? params[Axis.TYPE_NAME_BATCH_SIZE]
														: Axis.TYPE_DEFAULT_BATCH_SIZE;

		this._staticParams[Axis.TYPE_NAME_EPOCHS] = params[Axis.TYPE_NAME_EPOCHS] !== undefined
													? params[Axis.TYPE_NAME_EPOCHS]
													: Axis.TYPE_DEFAULT_EPOCHS;

		this._staticParams[Axis.TYPE_NAME_LAYERS] = params[Axis.TYPE_NAME_LAYERS] !== undefined
													? params[Axis.TYPE_NAME_LAYERS]
													: Axis.TYPE_DEFAULT_LAYERS;

		this._staticParams[Axis.TYPE_NAME_NEURONS] = params[Axis.TYPE_NAME_NEURONS] !== undefined
														? params[Axis.TYPE_NAME_NEURONS]
														: Axis.TYPE_DEFAULT_NEURONS;

		this._staticParams[Axis.TYPE_NAME_VALIDATION_SPLIT] = params[Axis.TYPE_NAME_VALIDATION_SPLIT] !== undefined
																? params[Axis.TYPE_NAME_VALIDATION_SPLIT]
																: Axis.TYPE_DEFAULT_VALIDATION_SPLIT;

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
		// this._staticParams.adamLearnRate = 0.001;
		// this._staticParams.adamaxDecayRate = 0.5;
		this._staticParams.dropoutEnabled1stHidden = false; // would be input layer, but for built-in inputs ><
		this._staticParams.dropoutEnabled2ndHidden = false;
		this._staticParams.dropoutRate = 0.05;

		// axes to be supported, eventually
// ??

		// potentially supported axes, but maybe never because they belong at a higher scope
// ??

//^^^^
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
		case Axis.TYPE_NAME_BATCH_SIZE:
		case Axis.TYPE_NAME_EPOCHS:
		case Axis.TYPE_NAME_NEURONS: {
			if (Utils.CheckPositiveInteger(value)) {
				return true;
			}

			errorSuffix = ModelStatics.ERROR_TEXT_POSITIVE_INTEGER;
		}
		break;

		case Axis.TYPE_NAME_LAYERS: {
			if (Utils.CheckNonNegativeInteger(value)) { // zero is allowed
				return true;
			}

			errorSuffix = ModelStatics.ERROR_TEXT_NON_NEGATIVE_INTEGER;
		}
		break;

		case Axis.TYPE_NAME_VALIDATION_SPLIT: {
			if (Utils.CheckFloat0to1Exclusive(value)) { // zero and one are not allowed; they disable TF validation
				return true;
			}

			errorSuffix = 'coming soon 32'//ModelStatics.ERROR_TEXT_NON_NEGATIVE_INTEGER;
		}
		break;

		default: {
			errorSuffix = ModelStatics.ERROR_TEXT_PARAM_UNKNOWN;
		}
	}

	errorData.message = '"' + key + '" is not valid. ' + errorSuffix;

	return false;
};


Object.freeze(ModelStatics);

exports.ModelStatics = ModelStatics;
