import * as TENSOR_FLOW from '@tensorflow/tfjs-node';
import { ArrayOrder2, TFNestedArray } from '../ts_types/Grid';
declare class SessionData {
    private _useDefaultStandardization;
    private _callbackStandardize?;
    private _callbackUnstandardize?;
    _rawInputsProof: TFNestedArray;
    _rawInputsTraining: TFNestedArray;
    _proofInputsTensor: TENSOR_FLOW.Tensor;
    _proofTargets: ArrayOrder2;
    _proofTargetsTensor: TENSOR_FLOW.Tensor;
    _totalInputNeurons: number;
    _totalOutputNeurons: number;
    _totalTrainingCases: number;
    _trainingInputsTensor: TENSOR_FLOW.Tensor;
    _trainingTargetsTensor: TENSOR_FLOW.Tensor;
    constructor(proofPercentage: number, rawInputs: TFNestedArray, rawTargets: ArrayOrder2, _useDefaultStandardization: boolean, _callbackStandardize?: ((unstandardizedInputs: TFNestedArray) => void) | undefined, _callbackUnstandardize?: ((standardizedInputs: TFNestedArray) => void) | undefined);
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
