import { StringKeyedNumbersObject } from './types';
import { Axis } from './Axis';
/**
 * Manages a collection of {@link Axis}.
 */
declare class AxisSet {
    private _axes;
    /**
     * Creates an instance of AxisSet.
     * @param {Array<Axis>} _axes An array of {@link Axis}. Each axis must have a unique hyperparameter.
     */
    constructor(_axes: Array<Axis>);
    /**
     * Pass-through to advance an axis.
     * @param {number} index The axis to advance.
     */
    AdvanceAxis(index: number): void;
    /**
     * Pass-through to check completion.
     * @param {number} index The axis to check.
     * @return {boolean}
     */
    CheckAxisComplete(index: number): boolean;
    /**
     * Builds a simple map in the format "{ axis0-name: axis0-value, ... }"
     * @return {StringKeyedNumbersObject}
     */
    CreateParams(): StringKeyedNumbersObject;
    /**
     * Gets the collection size.
     * @return {number}
     */
    GetTotalAxes(): number;
    /**
     * Pass-through to reset an axis.
     * @param {number} index The axis to reset.
     */
    ResetAxis(index: number): void;
    /**
     * Fails if an axis index is out-of-bounds.
     * @param {number} index The axis index to validate.
     */
    ValidateIndex(index: number): void;
    /**
     * Traverses the axis collection, invoking a callback for each.
     * @param {function(Axis): void} callback The function to be invoked with an instance of {@link Axis}.
     */
    Walk(callback: CallbackDoSomethingWithAxis): void;
    /**
     * Pass-through to get axis reports.
     * @param {number} index The axis to report.
     * @param {boolean} compact Whether to get a detailed report.
     * @return {string}
     */
    WriteAxisReport(index: number, compact: boolean): string;
}
declare type CallbackDoSomethingWithAxis = (axis: Axis) => void;
export { AxisSet };
