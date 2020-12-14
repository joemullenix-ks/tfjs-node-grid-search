'use strict';
import * as TENSOR_FLOW from '@tensorflow/tfjs-node';
//TODO: IMPORTANT: The import of this separate module (tfjs-layers) is probably the solution we need for the
//				   nested arrays issue in Grid types (and related files). Getting TF's native types in should
//				   preclude all of that Array<unknown> nonsense. Woot!
import { FailureMessage } from './FailureMessage';
import * as Axis from './Axis';
class ModelStatics {
    constructor(_userStatics) {
        // validate the user-supplied static model params, i.e. those params that never change during grid search
        this._userStatics = _userStatics;
        this._staticParams = {};
        const FAILURE_MESSAGE = new FailureMessage();
        for (const k in this._userStatics) {
            if (!Axis.Axis.AttemptValidateParameter(k, this._userStatics[k], FAILURE_MESSAGE)) {
                // fatal, so that users don't kick off a (potentially very long) grid search with a bad model config
                throw new Error('There was a problem with the static model this._userStatics. ' + FAILURE_MESSAGE.text);
            }
        }
        // params are valid; write the working set, backfilling w/ defaults for any the user left out
        this.WriteStaticParams();
    }
    AttemptStripParam(paramKey) {
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
    }
    //TODO: Each of these four 'Generate' calls will be overridable via user callback.
    GenerateInitializerBias() {
        //NOTE: See https://js.tensorflow.org/api/2.7.0/#class:initializers.Initializer
        return TENSOR_FLOW.initializers.constant({ value: 0.1 });
    }
    GenerateInitializerKernel() {
        //NOTE: See https://js.tensorflow.org/api/2.7.0/#class:initializers.Initializer
        return TENSOR_FLOW.initializers.heNormal({ seed: Math.random() });
    }
    //TODO: This will have a more complex type. It can take a string or string[], or a LossOrMetricFn or LossOrMetricFn[].
    GenerateLossFunction() {
        //NOTE: See https://js.tensorflow.org/api/2.7.0/#tf.LayersModel.compile
        return 'categoricalCrossentropy';
    }
    GenerateOptimizer(learnRate) {
        //NOTE: See https://js.tensorflow.org/api/2.7.0/#tf.LayersModel.compile
        console.assert(learnRate > 0.0);
        console.assert(learnRate < 1.0);
        return TENSOR_FLOW.train.adam(learnRate);
    }
    ShallowCloneParams() {
        return Object.assign({}, this._staticParams);
    }
    WriteStaticParams() {
        // set the user's value, or take the program default (these are optional from the user's point-of-view)
        this._staticParams[Axis.AxisNames.BATCH_SIZE] =
            this._userStatics[Axis.AxisNames.BATCH_SIZE] !== undefined
                ? this._userStatics[Axis.AxisNames.BATCH_SIZE]
                : Axis.AxisDefaults.BATCH_SIZE;
        this._staticParams[Axis.AxisNames.EPOCHS] =
            this._userStatics[Axis.AxisNames.EPOCHS] !== undefined
                ? this._userStatics[Axis.AxisNames.EPOCHS]
                : Axis.AxisDefaults.EPOCHS;
        this._staticParams[Axis.AxisNames.LAYERS] =
            this._userStatics[Axis.AxisNames.LAYERS] !== undefined
                ? this._userStatics[Axis.AxisNames.LAYERS]
                : Axis.AxisDefaults.LAYERS;
        this._staticParams[Axis.AxisNames.LEARN_RATE] =
            this._userStatics[Axis.AxisNames.LEARN_RATE] !== undefined
                ? this._userStatics[Axis.AxisNames.LEARN_RATE]
                : Axis.AxisDefaults.LEARN_RATE;
        this._staticParams[Axis.AxisNames.NEURONS] =
            this._userStatics[Axis.AxisNames.NEURONS] !== undefined
                ? this._userStatics[Axis.AxisNames.NEURONS]
                : Axis.AxisDefaults.NEURONS;
        this._staticParams[Axis.AxisNames.VALIDATION_SPLIT] =
            this._userStatics[Axis.AxisNames.VALIDATION_SPLIT] !== undefined
                ? this._userStatics[Axis.AxisNames.VALIDATION_SPLIT]
                : Axis.AxisDefaults.VALIDATION_SPLIT;
        // now we tack on the parameters that can't be axes (or rather not-yet-supported-as-axes)
        //TODO: The primary goal of this project is to support as many of these in as many ways as possible (progressions,
        //		custom schedules, randomizers, smart systems, ... ?).
        this._staticParams.activationHidden = 'relu';
        this._staticParams.activationInput = 'relu';
        this._staticParams.activationOutput = 'softmax';
    }
}
Object.freeze(ModelStatics);
export { ModelStatics };
//# sourceMappingURL=ModelStatics.js.map