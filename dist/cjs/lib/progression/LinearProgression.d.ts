import { Progression } from '../Progression';
/**
 * Defines a series of steps with a fixed interval.
 * @extends Progression
 * @example
 * // linear progression in steps of 2
 * new tngs.LinearProgression(2) // 0, 2, 4, 6, 8, ...
 *
 * // linear progression in steps of 0.75
 * new tngs.LinearProgression(0.75) // 0.0, 0.75, 1.5, 2.25, 3.0, ...
*/
declare class LinearProgression extends Progression {
    private _step;
    /**
     * Creates an instance of LinearProgression.
     * @param {number} step The series interval.
     */
    constructor(step: number);
    /**
     * Moves to the next value in the series.
     */
    Advance(): void;
}
export { LinearProgression };
