import * as TENSOR_FLOW from '@tensorflow/tfjs-node';
import { ArrayOrder2, TFNestedArray } from './types';
import { DataSet } from './DataSet';
declare class SessionData {
    private _useDefaultStandardization;
    private _callbackStandardize?;
    private _callbackUnstandardize?;
    private _rawInputsProof;
    private _rawInputsTraining;
    private _proofInputsTensor;
    private _proofTargets;
    private _totalInputNeurons;
    private _totalOutputNeurons;
    private _totalTrainingCases;
    private _trainingInputsTensor;
    private _trainingTargetsTensor;
    constructor(proofPercentage: number, dataSet: DataSet, _useDefaultStandardization: boolean, _callbackStandardize?: ((unstandardizedInputs: TFNestedArray) => void) | undefined, _callbackUnstandardize?: ((standardizedInputs: TFNestedArray) => void) | undefined);
    get proofInputsTensor(): TENSOR_FLOW.Tensor;
    get proofTargets(): ArrayOrder2;
    get rawInputsProof(): TFNestedArray;
    get totalInputNeurons(): number;
    get totalOutputNeurons(): number;
    get totalTrainingCases(): number;
    get trainingInputsTensor(): TENSOR_FLOW.Tensor;
    get trainingTargetsTensor(): TENSOR_FLOW.Tensor;
    SetupStandardization(): void;
    static ValidateRawData(raw: TFNestedArray): void;
}
export { SessionData };
