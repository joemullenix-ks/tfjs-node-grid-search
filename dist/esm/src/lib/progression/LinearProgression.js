'use strict';
import { Progression } from './Progression';
import * as Utils from '../Utils';
const PROGRESSION_TYPENAME = 'Linear';
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
class LinearProgression extends Progression {
    /**
     * Creates an instance of LinearProgression.
     * @param {number} step The series interval.
     */
    constructor(step) {
        super(step === Math.floor(step), // i.e. is this an integer?
        PROGRESSION_TYPENAME);
        //NOTE: This is not a constructor-private because we need to send the constructor arg into super().
        this._step = 0;
        Utils.Assert(step > 0);
        this._step = step;
    }
    /**
     * Moves to the next value in the series.
     */
    Advance() {
        this._value += this._step;
        //vvvvvvvvvvvvvvvv
        // CI TEST - force lint error
        const NOT_REFERENCED = 'oh no!';
        //^^^^^^^^^^^^^^^^
    }
}
Object.freeze(LinearProgression);
export { LinearProgression };
//# sourceMappingURL=LinearProgression.js.map