'use strict';


import { Progression } from '../Progression';


const PROGRESSION_TYPENAME = 'Linear';


class LinearProgression extends Progression {
//NOTE: This is not a constructor-private because we need to send the constructor arg into super().
	private _step: number = 0;

	constructor(step: number) {
		super(	step === Math.floor(step),	// i.e. is this an integer?
				PROGRESSION_TYPENAME);

		this._step = step;
	}

	Advance() {
		this._value += this._step;
	}
}


Object.freeze(LinearProgression);

export { LinearProgression };
