'use strict';


import * as Utils from '../Utils';


/**
 * Abstract base of the Progression classes.
 * @abstract
 */
abstract class Progression {
    protected _value: number;

    /**
     * Creates an instance of Progression.
     * @param {boolean} _integerBased Send 'true' if this progression uses
     *                                integer steps exclusively (as opposed to
     *                                floating-point).
     * @param {string} _typeName A simple label for logging.
     */
    constructor(private _integerBased: boolean, // "integerBased" as opposed to floating point
                private _typeName: string) {
        Utils.Assert(this._typeName !== '');

//NOTE: All progressions begin at zero, because the bounds of the range we traverse are inclusive.
        this._value = 0;
    }

    get integerBased(): boolean { return this._integerBased; }
    get typeName(): string { return this._typeName; }
    get value(): number { return this._value; }

    /**
     * Puts the progression in its initial state (_value = 0).
     */
    Reset(): void {
        this._value = 0;
    }

    abstract Advance(): void
}


Object.freeze(Progression);

export { Progression };
