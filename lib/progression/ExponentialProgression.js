'use strict';


const { Progression } = require('../Progression');


const PROGRESSION_TYPENAME = 'Exponential';


class ExponentialProgression extends Progression {
	constructor(exponent, scale) {
		super(	exponent === Math.floor(exponent) && scale === Math.floor(scale),	// i.e. are these integers?
				PROGRESSION_TYPENAME);

		console.assert(typeof exponent === 'number');
		console.assert(typeof scale === 'number');

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

exports.ExponentialProgression = ExponentialProgression;
