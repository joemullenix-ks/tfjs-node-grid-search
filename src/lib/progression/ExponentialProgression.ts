'use strict';


import { Progression } from '../Progression';


const PROGRESSION_TYPENAME = 'Exponential';


class ExponentialProgression extends Progression {
//NOTE: These are not constructor-privates because we need to send the constructor's args into super().
	private _exponent: number = 0;
	private _scale: number = 0;
	private _step: number = 0;

	constructor(exponent: number, scale: number) {
		super(	exponent === Math.floor(exponent) && scale === Math.floor(scale),	// i.e. are these integers?
				PROGRESSION_TYPENAME);

		// these rules prevent the progression going flat (infinite) or negative (yikes)

//NOTE: We could support whackier curves, and will if requested. I don't anticipate that desire, but who knows.
//		Also, the user may create a negative progression by inverting their Axis bounds; send a boundBegin > boundEnd.
		console.assert(exponent > 1.0);
		console.assert(scale > 0.0);

		this._exponent = exponent;
		this._scale = scale;

		// this initializes '_step'
		this.ResetStep();
	}

	Advance() {
		this._value = this._scale * Math.pow(this._exponent, this._step);

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
