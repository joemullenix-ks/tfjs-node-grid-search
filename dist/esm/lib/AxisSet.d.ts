import { StringKeyedNumbersObject } from '../ts_types/common';
import { Axis } from './Axis';
declare class AxisSet {
    private _axes;
    constructor(_axes: Array<Axis>);
    AdvanceAxis(index: number): void;
    CheckAxisComplete(index: number): boolean;
    CreateParams(): StringKeyedNumbersObject;
    GetTotalAxes(): number;
    ResetAxis(index: number): void;
    ValidateIndex(index: number): void;
    Walk(callback: (axis: Axis) => void): void;
    WriteAxisReport(index: number, compact: boolean): string;
}
export { AxisSet };
