import { ArrayOrder2, TFNestedArray } from './types';
declare class DataSet {
    private _inputs;
    private _targets;
    constructor(_inputs: TFNestedArray, _targets: ArrayOrder2);
    get inputs(): TFNestedArray;
    get targets(): ArrayOrder2;
}
export { DataSet };
