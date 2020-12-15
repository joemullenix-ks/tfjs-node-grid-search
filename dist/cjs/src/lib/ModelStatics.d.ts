import * as TENSOR_FLOW from '@tensorflow/tfjs-node';
import * as TF_INITIALIZERS from '@tensorflow/tfjs-layers/dist/initializers';
import * as Types from './types';
/**
 * Manages the hyperparameters that do <i>not</i> change over the course of
 * the grid search (i.e. those not governed by an {@link Axis}).
 */
declare class ModelStatics {
    private _userStatics;
    private _staticParams;
    /**
     * Creates an instance of ModelStatics.<br>
     * - See {@link Axis.AxisTypes} for the available fields.<br>
     * - See {@link Axis.AxisDefaults} for defaults.<br>
     * All fields are optional. Any field used here that also has an axis will
     * be ignored (the dynamic axis values will be used instead).
     * @param {Types.StringKeyedNumbersObject} _userStatics
     * @example
     * new tngs.ModelStatics({
     *   batchSize: 10,
     *   epochs: 50,
     *   hiddenLayers: 2,
     *   learnRate: 0.001,
     *   neuronsPerHiddenLayer: 16,
     *   validationSplit: 0.2
     * });
     */
    constructor(_userStatics: Types.StringKeyedNumbersObject);
    /**
     * Check whether the received parameter key is also part in our set. If so,
     * delete the entry, after printing an informative warning to the log.
     * @param {string} paramKey
     */
    AttemptStripParam(paramKey: string): void;
    /**
     * Produces a TensorFlow initializer for bias nodes.<br>
     * Currently set to constant(0.1)
     * @return {TF_INITIALIZERS.Initializer}
     */
    GenerateInitializerBias(): TF_INITIALIZERS.Initializer;
    /**
     * Produces a TensorFlow initializer for kernel nodes.<br>
     * Currently set to heNormal()
     * @return {TF_INITIALIZERS.Initializer}
     */
    GenerateInitializerKernel(): TF_INITIALIZERS.Initializer;
    /**
     * Produces a TensorFlow loss function identifier.<br>
     * Currently set to "categoricalCrossentropy"
     * @return {string}
     */
    GenerateLossFunction(): string;
    /**
     * Produces a TensorFlow optimizer.<br>
     * Currently set to adam(learnRate)
     * @param {number} learnRate The learning rate. See {@link https://en.wikipedia.org/wiki/Stochastic_gradient_descent#Adam}
     * @return {TENSOR_FLOW.Optimizer}
     */
    GenerateOptimizer(learnRate: number): TENSOR_FLOW.Optimizer;
    /**
     * Produce a shallow clone of the remaining parameters as a simple object.
     * @return {Types.StringKeyedSimpleObject}
     */
    ShallowCloneParams(): Types.StringKeyedSimpleObject;
    /**
     * Build an object with all available axes (hyperparams), taking the user's
     * value if available, otherwise taking the system default.
     * @private
     */
    private WriteStaticParams;
}
export { ModelStatics };
