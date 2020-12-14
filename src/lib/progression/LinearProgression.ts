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
//NOTE: This is not a constructor-private because we need to send the constructor arg into super().
	private _step = 0;

	/**
	 * Creates an instance of LinearProgression.
	 * @param {number} step The series interval.
	 */
	constructor(step: number) {
		super(	step === Math.floor(step),	// i.e. is this an integer?
				PROGRESSION_TYPENAME);

		Utils.Assert(step > 0);

		this._step = step;
	}

	/**
	 * Moves to the next value in the series.
	 */
	Advance(): void {
		this._value += this._step;
	}
}


Object.freeze(LinearProgression);

export { LinearProgression };
