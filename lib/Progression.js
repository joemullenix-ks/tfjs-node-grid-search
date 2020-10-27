'use strict';


class Progression {
	constructor(typeEnum, base, modifier) {
		console.assert(typeof typeEnum === 'number');
		console.assert(typeEnum >= 0 && typeEnum < Progression.TOTAL_TYPES);

		switch (typeEnum) {
			case Progression.TYPE_EXPONENTIAL: {
				console.assert(typeof base === 'number');

//NOTE: A 'base' (the exponent) below one would cause the value to decline, and one would hold it constant. There are not
//		technical problems, but they add unneeded complexity.
//		The user can set inverted bounds to achieve declining behavior, and progressions don't apply if they want a constant.
				console.assert(base > 1);

				if (modifier !== null && modifier !== undefined) {
					console.warn('exponential progression does not use a modifier; ignored');
				}

				modifier = 0;

				// Examples of _EXPONENTIAL:
				//
				//	BASE	RESULT
				// 	2		0, 1, 2, 4, 8, ...
				// 	3		0, 1, 3, 9, 27, ...
				// 	1.5		0, 1, 1, 2, 3, ... // floor'd from 0, 1, 1.5, 2.25, 3.375, ...
			}
			break;

			case Progression.TYPE_FIBONACCI: {
				if (   (base !== null && base !== undefined)
					|| (modifier !== null && modifier !== undefined)) {
					console.warn('Fibonacci(ish) ignores base and modifier (progression starts with 0, 1, 2, ...)');
				}

//NOTE: We don't use the true beginning of the Fibonacci sequence. Instead of {0, 1, 1, ...}, we start with {0, 1, 2, ...},
//		because (we assume) the user doesn't want to repeat step 1.
//
//TODO: Support true Fibonacci on a flag, or as a distinct type, by initializing 'modifier' to zero/

				base = 1;
				modifier = 1;

				// Examples of _FIBONACCI:
				//
				//	BASE	MODIFIER	RESULT
				// 	0		1			0, 1, 2, 3, 5, 8, ...
			}
			break;

			case Progression.TYPE_LINEAR: {
				console.assert(typeof base === 'number');

				if (modifier !== null && modifier !== undefined) {
					console.warn('linear progression does not use a modifier; ignored');
				}

				console.assert(base >= 1);

				// Examples of _LINEAR:
				//
				//	BASE	RESULT
				// 	1		0, 1, 2, 3, ...
				// 	2.5		0, 2, 5, 7, ... // floor'd from 0, 2.5, 5, 7.5, ...
			}
			break;

			default: {
				throw new Error('invalid enum: ' + typeEnum);
			}
		}

		this._typeEnum = typeEnum;
		this._base = base;
		this._modifier = modifier;

		this._value = 0;
	}

	Advance() {
		switch (this._typeEnum) {
			case Progression.TYPE_EXPONENTIAL: {
				this._value = Math.pow(this._base, this._modifier);

				++this._modifier;

				return;
			}

			case Progression.TYPE_FIBONACCI: {
				this._value = this._base;

				const TEMP = this._modifier;

				this._modifier = this._base;

				this._base = TEMP + this._modifier;

				return;
			}

			case Progression.TYPE_LINEAR: {
				this._value += this._base;

				return;
			}

			default: {
				throw new Error('invalid enum: ' + this._typeEnum);
			}
		}

		throw new Error('switch failed to exit: ' + this._typeEnum);
	}

	GetValue() {
		return Math.floor(this._value);
	}
}

let enumKey = 0;

Progression.TYPE_EXPONENTIAL	= enumKey++;	Progression.TYPE_NAME_EXPONENTIAL	= 'exponential';
Progression.TYPE_FIBONACCI		= enumKey++;	Progression.TYPE_NAME_FIBONACCI		= 'fibonacci';
Progression.TYPE_LINEAR			= enumKey++;	Progression.TYPE_NAME_LINEAR		= 'linear';
Progression.TOTAL_TYPES = enumKey;

Progression.LookupTypeName = (x) => {
	switch (x) {
		case Progression.TYPE_EXPONENTIAL:	return Progression.TYPE_NAME_EXPONENTIAL;
		case Progression.TYPE_FIBONACCI:	return Progression.TYPE_NAME_FIBONACCI;
		case Progression.TYPE_LINEAR:		return Progression.TYPE_NAME_LINEAR;

		default: {
			throw new Error('invalid enum index: ' + x + '/' + Progression.TOTAL_TYPES);
		}
	}
};


Object.freeze(Progression);

exports.Progression = Progression;
