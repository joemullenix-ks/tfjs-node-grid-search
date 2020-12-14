'use strict';
import * as Utils from '../Utils';
/**
 * Abstract base of the Progression classes.
 * @abstract
 */
class Progression {
    /**
     * Creates an instance of Progression.
     * @param {boolean} _integerBased Send 'true' if this progression uses
     *								  integer steps exclusively (as opposed to
     *								  floating-point).
     * @param {string} _typeName A simple label for logging.
     */
    constructor(_integerBased, // "integerBased" as opposed to floating point
    _typeName) {
        this._integerBased = _integerBased;
        this._typeName = _typeName;
        Utils.Assert(this._typeName !== '');
        //NOTE: All progressions begin at zero, because the bounds of the range we traverse are inclusive.
        this._value = 0;
    }
    get integerBased() { return this._integerBased; }
    get typeName() { return this._typeName; }
    get value() { return this._value; }
    /**
     * Puts the progression in its initial state (_value = 0).
     */
    Reset() {
        this._value = 0;
    }
}
Object.freeze(Progression);
export { Progression };
//# sourceMappingURL=Progression.js.map