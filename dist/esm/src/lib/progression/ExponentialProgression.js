'use strict';
import { Progression } from './Progression';
import * as Utils from '../Utils';
const PROGRESSION_TYPENAME = 'Exponential';
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
class ExponentialProgression extends Progression {
    /**
     * Creates an instance of ExponentialProgression. The series is calculated
     * like this: { 0, base ^ 0 * scale, base ^ 1 * scale, base ^ 2 * scale, ... }.
     * @param {number} base The base of the function. Must be > 1.0.
     * @param {number} scale The scale of the function. Must be > 0.0.
     */
    constructor(base, scale) {
        super(base === Math.floor(base) && scale === Math.floor(scale), // i.e. are these integers?
        PROGRESSION_TYPENAME);
        //NOTE: These are not constructor-privates because we need to send the constructor's args into super().
        this._base = 0;
        this._scale = 0;
        this._step = 0;
        // these rules prevent the progression going flat (infinite) or negative (yikes)
        //NOTE: We could support whackier curves, and will if requested. I don't anticipate that desire, but who knows.
        //		Also, the user may create a negative progression by inverting their Axis bounds, i.e. use boundBegin > boundEnd.
        Utils.Assert(base > 1.0);
        Utils.Assert(scale > 0.0);
        this._base = base;
        this._scale = scale;
        // this initializes '_step'
        this.ResetStep();
    }
    /**
     * Moves to the next value in the series.
     */
    Advance() {
        this._value = this._scale * Math.pow(this._base, this._step);
        ++this._step;
    }
    Reset() {
        super.Reset();
        this.ResetStep();
    }
    ResetStep() {
        this._step = 0;
    }
}
Object.freeze(ExponentialProgression);
export { ExponentialProgression };
//# sourceMappingURL=ExponentialProgression.js.map