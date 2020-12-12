import { Progression } from '../Progression';
/**
 * Defines a series of steps that increase exponentially.
 * @extends Progression
 * @example
 * // Exponential progression with base 2, scale 1
 * new tngs.ExponentialProgression(2, 1) // 0, 1, 2, 4, 8, ...
 *
 * // Exponential progression with base 1.5, scale 0.5
 * new tngs.ExponentialProgression(1.5, 0.5) // 0.0, 0.5, 0.75, 1.125, 1.6875, ...
 */
declare class ExponentialProgression extends Progression {
    private _base;
    private _scale;
    private _step;
    /**
     * Creates an instance of ExponentialProgression. The series is calculated
     * like this: { 0, base ^ 0 * scale, base ^ 1 * scale, base ^ 2 * scale, ... }.
     * @param {number} base The base of the function. Must be > 1.0.
     * @param {number} scale The scale of the function. Must be > 0.0.
     */
    constructor(base: number, scale: number);
    /**
     * Moves to the next value in the series.
     */
    Advance(): void;
    Reset(): void;
    private ResetStep;
}
export { ExponentialProgression };
