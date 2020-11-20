'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelStatics = void 0;
var TENSOR_FLOW = require('@tensorflow/tfjs');
var FailureMessage = require('./FailureMessage').FailureMessage;
var Axis = __importStar(require("./Axis"));
var ModelStatics = /** @class */ (function () {
    function ModelStatics(_userStatics) {
        // validate the user-supplied static model params, i.e. those params that never change during grid search
        this._userStatics = _userStatics;
        this._staticParams = {};
        var FAILURE_MESSAGE = new FailureMessage();
        for (var k in this._userStatics) {
            if (!Axis.Axis.AttemptValidateParameter(k, this._userStatics[k], FAILURE_MESSAGE)) {
                // fatal, so that users don't kick off a (potentially very long) grid search with a bad model config
                throw new Error('There was a problem with the static model this._userStatics. ' + FAILURE_MESSAGE.text);
            }
        }
        // params are valid; write the working set, backfilling w/ defaults for any the user left out
        this.WriteStaticParams();
    }
    ModelStatics.prototype.AttemptStripParam = function (paramKey) {
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
        console.assert(learnRate > 0.0);
        console.assert(learnRate < 1.0);
        return TENSOR_FLOW.train.adam(learnRate);
    };
    ModelStatics.prototype.ShallowCloneParams = function () {
        return Object.assign({}, this._staticParams);
    };
    ModelStatics.prototype.WriteStaticParams = function () {
        // set the user's value, or take the program default (these are optional from the user's point-of-view)
        this._staticParams["batchSize" /* BATCH_SIZE */] =
            this._userStatics["batchSize" /* BATCH_SIZE */] !== undefined
                ? this._userStatics["batchSize" /* BATCH_SIZE */]
                : 10 /* BATCH_SIZE */;
        this._staticParams["epochs" /* EPOCHS */] =
            this._userStatics["epochs" /* EPOCHS */] !== undefined
                ? this._userStatics["epochs" /* EPOCHS */]
                : 50 /* EPOCHS */;
        this._staticParams["hiddenLayers" /* LAYERS */] =
            this._userStatics["hiddenLayers" /* LAYERS */] !== undefined
                ? this._userStatics["hiddenLayers" /* LAYERS */]
                : 2 /* LAYERS */;
        this._staticParams["learnRate" /* LEARN_RATE */] =
            this._userStatics["learnRate" /* LEARN_RATE */] !== undefined
                ? this._userStatics["learnRate" /* LEARN_RATE */]
                : 0.001 /* LEARN_RATE */;
        this._staticParams["neuronsPerHiddenLayer" /* NEURONS */] =
            this._userStatics["neuronsPerHiddenLayer" /* NEURONS */] !== undefined
                ? this._userStatics["neuronsPerHiddenLayer" /* NEURONS */]
                : 16 /* NEURONS */;
        this._staticParams["validationSplit" /* VALIDATION_SPLIT */] =
            this._userStatics["validationSplit" /* VALIDATION_SPLIT */] !== undefined
                ? this._userStatics["validationSplit" /* VALIDATION_SPLIT */]
                : 0.2 /* VALIDATION_SPLIT */;
        // now we tack on the parameters that can't be axes (or rather not-yet-supported-as-axes)
        //TODO: The primary goal of this project is to support as many of these in as many ways as possible (progressions,
        //		custom schedules, randomizers, smart systems, ... ?).
        this._staticParams.activationHidden = 'relu';
        this._staticParams.activationInput = 'relu';
        this._staticParams.activationOutput = 'softmax';
    };
    return ModelStatics;
}());
exports.ModelStatics = ModelStatics;
Object.freeze(ModelStatics);
//# sourceMappingURL=ModelStatics.js.map