import * as TENSOR_FLOW from '@tensorflow/tfjs-node';
import { ArrayOrder2, TFNestedArray } from './types';
import { DataSet } from './DataSet';
/**
 * Manages the data set used to train and test models during the grid search.
 */
declare class SessionData {
    private _useDefaultStandardization;
    private _callbackStandardize?;
    private _rawInputsProof;
    private _rawInputsTraining;
    private _proofInputsTensor;
    private _proofTargets;
    private _totalInputNeurons;
    private _totalOutputNeurons;
    private _totalTrainingCases;
    private _trainingInputsTensor;
    private _trainingTargetsTensor;
    /**
     * Creates an instance of SessionData.
     * @param {number} proofPercentage A value 0-1 exclusive used to determine
     *	the number of cases reserved for generalization testing. These cases
     *	are never seen by the model during training.<br>
     *	A common value is 0.2 (20%).
     * @param {DataSet} dataSet The data used to train and test models.
     * @param {boolean} _useDefaultStandardization If true, the input values
     *	will be modified internally such that each feature has a mean of zero
     *	and a variance of one.<br>
     *	If standardization callbacks are supplied, this argument is ignored.
     * @param {function} [_callbackStandardize] A function invoked with the
     *	input data prior to the grid search. It provides an opportunity to
     *	preprocess the data internally before it's transformed into tensors.<br>
     *  <b>Arguments:</b> unstandardizedInputs: Array<unknown><br>
     *  <b>Returns:</b> void
     */
    constructor(proofPercentage: number, dataSet: DataSet, _useDefaultStandardization: boolean, _callbackStandardize?: ((unstandardizedInputs: TFNestedArray) => void) | undefined);
    get proofInputsTensor(): TENSOR_FLOW.Tensor;
    get proofTargets(): ArrayOrder2;
    get rawInputsProof(): TFNestedArray;
    get totalInputNeurons(): number;
    get totalOutputNeurons(): number;
    get totalTrainingCases(): number;
    get trainingInputsTensor(): TENSOR_FLOW.Tensor;
    get trainingTargetsTensor(): TENSOR_FLOW.Tensor;
    /**
     * Determines the standardization scheme to be used.
     * @private
     */
    private SetupStandardization;
    /**
     * Throws unless the input data is comprised of arrays of numbers, only.
     * The arrays may be nested.
     * Note that we do <i>not</i> enforce full tensor validity. TF will happily
     * throw on invalid data. This is a quick step to catch more obvious issues
     * before training/testing, and communicate them in a more friendly manner.
     * @private
     * @static
     * @param {TFNestedArray} raw
     */
    private static ValidateRawData;
}
export { SessionData };
