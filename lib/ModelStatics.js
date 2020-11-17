'use strict';


const TENSOR_FLOW = require('@tensorflow/tfjs');


const { Axis } = require('./Axis');


class ModelStatics {
	constructor(params) {
		console.assert(typeof params === 'object'); //NOTE: This model-settings block is Plain Old Data.

		// validate the user-supplied model params

//vv TODO: Abstract this error object into a class (or merge in the 'f' libs).
		const VALIDATION_ERROR = {message: ''};

		for (let k in params) {
			if (!Axis.AttemptValidateParameter(k, params[k], VALIDATION_ERROR)) {
				// fatal, so that users don't kick off a (potentially very long) grid search with a bad model config
				throw new Error('There was a problem with the static model params. ' + VALIDATION_ERROR.message);
			}
		}
//^^

		// the axes and param arguments are valid

		// setup the static model params, i.e. those params that never change from iteration to iteration

		this._staticParams = {};

		this.WriteStaticParams(params);

		// keep the user's originals on hand
		this._userStatics = params;
	}

	AttemptStripParam(paramKey) {
		console.assert(typeof paramKey === 'string');
		console.assert(paramKey !== '');

		if (this._staticParams[paramKey] === undefined) {
			// nothing to strip
			return;
		}

		// this static param will be dropped

		// if the user sent this (as opposed to it being a default), warn them that it won't be used
		if (this._userStatics[paramKey] !== undefined) {
			console.warn('"' + paramKey + '" will be ignored as a static model param. (It\'s likely managed by a dynamic grid axis.)');
		}

		delete this._staticParams[paramKey];
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

	WriteStaticParams(params) {
		console.assert(typeof params === 'object');

		// set the user's value, or take the program default (every param is optional)

		this._staticParams[Axis.TYPE_NAME_BATCH_SIZE] =
			params[Axis.TYPE_NAME_BATCH_SIZE] !== undefined
			? params[Axis.TYPE_NAME_BATCH_SIZE]
			: Axis.TYPE_DEFAULT_BATCH_SIZE;

		this._staticParams[Axis.TYPE_NAME_EPOCHS] =
			params[Axis.TYPE_NAME_EPOCHS] !== undefined
			? params[Axis.TYPE_NAME_EPOCHS]
			: Axis.TYPE_DEFAULT_EPOCHS;

		this._staticParams[Axis.TYPE_NAME_LAYERS] =
			params[Axis.TYPE_NAME_LAYERS] !== undefined
			? params[Axis.TYPE_NAME_LAYERS]
			: Axis.TYPE_DEFAULT_LAYERS;

		this._staticParams[Axis.TYPE_NAME_NEURONS] =
			params[Axis.TYPE_NAME_NEURONS] !== undefined
			? params[Axis.TYPE_NAME_NEURONS]
			: Axis.TYPE_DEFAULT_NEURONS;

		this._staticParams[Axis.TYPE_NAME_VALIDATION_SPLIT] =
			params[Axis.TYPE_NAME_VALIDATION_SPLIT] !== undefined
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

//^^^^
	}
}


Object.freeze(ModelStatics);

exports.ModelStatics = ModelStatics;
