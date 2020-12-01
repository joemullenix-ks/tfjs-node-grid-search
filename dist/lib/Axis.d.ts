import { FailureMessage } from './FailureMessage';
import { Progression } from './Progression';
declare class Axis {
    private _typeEnum;
    private _boundBegin;
    private _boundEnd;
    private _progression;
    private _forward;
    private _typeName;
    constructor(_typeEnum: number, _boundBegin: number, _boundEnd: number, _progression: Progression);
    get type(): number;
    get typeName(): string;
    Advance(): void;
    CalculatePosition(): number;
    CheckComplete(): boolean;
    Reset(): void;
    WriteReport(compact: boolean): string;
    static AttemptValidateParameter(key: string, value: number, failureMessage: FailureMessage): boolean;
    static AttemptValidateProgression(key: string, progression: Progression, failureMessage: FailureMessage): boolean;
    static LookupTypeName(x: number): string;
}
declare const enum Defaults {
    BATCH_SIZE = 10,
    EPOCHS = 50,
    LAYERS = 2,
    LEARN_RATE = 0.001,
    NEURONS = 16,
    VALIDATION_SPLIT = 0.2
}
declare const enum Names {
    BATCH_SIZE = "batchSize",
    EPOCHS = "epochs",
    LAYERS = "hiddenLayers",
    LEARN_RATE = "learnRate",
    NEURONS = "neuronsPerHiddenLayer",
    VALIDATION_SPLIT = "validationSplit"
}
declare const enum Types {
    BATCH_SIZE = 0,
    EPOCHS = 1,
    LAYERS = 2,
    LEARN_RATE = 3,
    NEURONS = 4,
    VALIDATION_SPLIT = 5,
    _TOTAL = 6
}
export { Axis, Defaults, Names, Types };
