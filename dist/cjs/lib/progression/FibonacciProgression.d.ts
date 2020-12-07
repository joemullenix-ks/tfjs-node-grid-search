import { Progression } from '../Progression';
/**
 * Defines a series of steps starting from an arbitrary point in the Fibonacci
 * sequence.
 * @extends Progression
 * @example
 * // Fibonacci progression starting at 0*
 * new tngs.FibonacciProgression(0) // 0, 1, 2, 3, 5, ...
 *
 * // Fibonacci progression starting at 5
 * new tngs.FibonacciProgression(5) // 5, 8, 13, 21, 34, ...
 *
 * // *To prevent repeating models, the beginning of the Fibonacci sequence is tweaked.
 */
declare class FibonacciProgression extends Progression {
    private _initiator;
    private _fiboA;
    private _fiboB;
    private _initFiboA;
    private _initFiboB;
    /**
    * Creates an instance of FibonacciProgression.
    * @param {number} _initiator The starting point in the Fibonacci sequence.
    */
    constructor(_initiator: number);
    /**
     * Moves to the next value in the series.
     * @memberof FibonacciProgression
     */
    Advance(): void;
    Reset(): void;
    private ResetFibonacciInputs;
}
export { FibonacciProgression };
