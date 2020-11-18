'use strict';


const { Progression } = require('../Progression');


const PROGRESSION_TYPENAME = 'Linear';


class LinearProgression extends Progression {
	constructor(step) {
		super(	step === Math.floor(step),	// i.e. is this an integer?
				PROGRESSION_TYPENAME);

		console.assert(typeof step === 'number');

		this._step = step;
	}

	Advance() {
		this._value += this._step;
	}
}


Object.freeze(LinearProgression);

exports.LinearProgression = LinearProgression;
