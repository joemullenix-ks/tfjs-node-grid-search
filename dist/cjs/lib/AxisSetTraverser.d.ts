import { StringKeyedNumbersObject } from './types';
import { AxisSet } from './AxisSet';
/**
 * Manages an {@link AxisSet}.
 * Performs the selection of hyperparameter values during the grid search.
 */
declare class AxisSetTraverser {
    private _axisSet;
    private _totalAxes;
    private _traversed;
    private _iterationDescriptorsByIndex;
    private _totalIterations;
    /**
     * Creates an instance of AxisSetTraverser.
     * @param {AxisSet} _axisSet The collection of {@link Axis} that define the
     *							 grid (parameter space) to be searched. Each
     *							 axis is associated with one hyperparameter.
     */
    constructor(_axisSet: AxisSet);
    get totalIterations(): number;
    get traversed(): boolean;
    /**
     * Iterates the grid. Called after each 'cell' (i.e. unique
     * combination of hyperparameters) is trained and tested. Once all axes
     * are complete, we mark ourselves as traversed (or done).
     */
    Advance(): void;
    /**
     * Produces a simple key: value mapping of the axes current positions,
     * keyed by their names.
     * @return {StringKeyedNumbersObject}
     */
    CreateIterationParams(): StringKeyedNumbersObject;
    /**
     * Traverses the axis set, invoking a callback with the name of each axis.
     * @param {function(string): void} callback The function to be invoked.
     */
    ExamineAxisNames(callback: CallbackDoSomethingWithAxisName): void;
    /**
     * Gets the descriptor for a requested axis. We build these simple strings
     * in the constructor.
     * @param {number} index The axis to be described.
     * @return {string}
     */
    LookupIterationDescriptor(index: number): string;
    /**
     * Gets a combined report of every axis' status.
     * @param {boolean} compact Whether to get a detailed report.
     * @return {string}
     */
    WriteReport(compact: boolean): string;
}
declare type CallbackDoSomethingWithAxisName = (axisKey: string) => void;
export { AxisSetTraverser };
