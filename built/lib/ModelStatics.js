'use strict';
var TENSOR_FLOW = require('@tensorflow/tfjs');
var Axis = require('./Axis').Axis;
var FailureMessage = require('./FailureMessage').FailureMessage;
var ModelStatics = /** @class */ (function () {
    function ModelStatics(params) {
        console.assert(typeof params === 'object');
        // validate the user-supplied model params
        var FAILURE_MESSAGE = new FailureMessage();
        for (var k in params) {
            if (!Axis.AttemptValidateParameter(k, params[k], FAILURE_MESSAGE)) {
                // fatal, so that users don't kick off a (potentially very long) grid search with a bad model config
                throw new Error('There was a problem with the static model params. ' + FAILURE_MESSAGE.text);
            }
        }
        // the axes and param arguments are valid
        // setup the static model params, i.e. those params that never change from iteration to iteration
        this._staticParams = {};
        this.WriteStaticParams(params);
        // keep the user's originals on hand
        this._userStatics = params;
    }
    ModelStatics.prototype.AttemptStripParam = function (paramKey) {
        console.assert(typeof paramKey === 'string');
        console.assert(paramKey !== '');
        if (this._staticParams[paramKey] === undefined) {
            // nothing to strip
            return;
        }
        // this static param will be dropped
        // if the user sent this (as opposed to it being a default), warn them that it won't be used
        if (this._userStatics[paramKey] !== undefined) {
            console.warn('The static model param "' + paramKey + '" will be ignored. (It\'s likely overridden by a dynamic grid axis.)');
        }
        delete this._staticParams[paramKey];
    };
    ModelStatics.prototype.GenerateInitializerBias = function () {
        //NOTE: See https://js.tensorflow.org/api/2.7.0/#class:initializers.Initializer
        return TENSOR_FLOW.initializers.constant({ value: 0.1 });
    };
    ModelStatics.prototype.GenerateInitializerKernel = function () {
        //NOTE: See https://js.tensorflow.org/api/2.7.0/#class:initializers.Initializer
        return TENSOR_FLOW.initializers.heNormal({ seed: Math.random() });
    };
    ModelStatics.prototype.GenerateLossFunction = function () {
        //NOTE: See https://js.tensorflow.org/api/2.7.0/#tf.LayersModel.compile
        return 'categoricalCrossentropy';
    };
    ModelStatics.prototype.GenerateOptimizer = function (learnRate) {
        //NOTE: See https://js.tensorflow.org/api/2.7.0/#tf.LayersModel.compile
        console.assert(typeof learnRate === 'number');
        console.assert(learnRate > 0.0);
        console.assert(learnRate < 1.0);
        return TENSOR_FLOW.train.adam(learnRate);
    };
    ModelStatics.prototype.ShallowCloneParams = function () {
        return Object.assign({}, this._staticParams);
    };
    ModelStatics.prototype.WriteStaticParams = function (params) {
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
        this._staticParams[Axis.TYPE_NAME_LEARN_RATE] =
            params[Axis.TYPE_NAME_LEARN_RATE] !== undefined
                ? params[Axis.TYPE_NAME_LEARN_RATE]
                : Axis.TYPE_DEFAULT_LEARN_RATE;
        this._staticParams[Axis.TYPE_NAME_NEURONS] =
            params[Axis.TYPE_NAME_NEURONS] !== undefined
                ? params[Axis.TYPE_NAME_NEURONS]
                : Axis.TYPE_DEFAULT_NEURONS;
        this._staticParams[Axis.TYPE_NAME_VALIDATION_SPLIT] =
            params[Axis.TYPE_NAME_VALIDATION_SPLIT] !== undefined
                ? params[Axis.TYPE_NAME_VALIDATION_SPLIT]
                : Axis.TYPE_DEFAULT_VALIDATION_SPLIT;
        // now we tack on the parameters that can't be axes (or rather not-yet-supported-as-axes)
        //TODO: The primary goal of this project is to support as many of these in as many ways as possible (progressions,
        //		custom schedules, randomizers, smart systems, ... ?).
        this._staticParams.activationHidden = 'relu';
        this._staticParams.activationInput = 'relu';
        this._staticParams.activationOutput = 'softmax';
    };
    return ModelStatics;
}());
Object.freeze(ModelStatics);
exports.ModelStatics = ModelStatics;
