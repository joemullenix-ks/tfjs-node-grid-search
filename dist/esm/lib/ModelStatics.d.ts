import * as TENSOR_FLOW from '@tensorflow/tfjs-node';
import * as TF_INITIALIZERS from '@tensorflow/tfjs-layers/dist/initializers';
import * as Types from './types';
declare class ModelStatics {
    private _userStatics;
    private _staticParams;
    constructor(_userStatics: Types.StringKeyedNumbersObject);
    AttemptStripParam(paramKey: string): void;
    GenerateInitializerBias(): TF_INITIALIZERS.Initializer;
    GenerateInitializerKernel(): TF_INITIALIZERS.Initializer;
    GenerateLossFunction(): string;
    GenerateOptimizer(learnRate: number): TENSOR_FLOW.Optimizer;
    ShallowCloneParams(): Types.StringKeyedSimpleObject;
    WriteStaticParams(): void;
}
export { ModelStatics };
