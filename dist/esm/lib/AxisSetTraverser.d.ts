import { StringKeyedNumbersObject } from './types';
import { AxisSet } from './AxisSet';
declare class AxisSetTraverser {
    private _axisSet;
    private _totalAxes;
    private _traversed;
    private _iterationDescriptorsByIndex;
    private _totalIterations;
    constructor(_axisSet: AxisSet);
    get totalIterations(): number;
    get traversed(): boolean;
    Advance(): void;
    CreateIterationParams(): StringKeyedNumbersObject;
    ExamineAxisNames(callback: (axisKey: string) => void): void;
    LookupIterationDescriptor(index: number): string;
    WriteReport(compact: boolean): string;
}
export { AxisSetTraverser };
