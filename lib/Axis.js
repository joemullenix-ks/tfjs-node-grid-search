'use strict';


const { Progression } = require('./Progression');


class Axis {
	constructor(typeEnum, boundBegin, boundEnd, progression) {
		console.assert(typeof typeEnum === 'number');
		console.assert(typeEnum >= 0 && typeEnum < Axis.TOTAL_TYPES);

		console.assert(typeof boundEnd === 'number');
		console.assert(typeof boundBegin === 'number');

		const BOUNDS_DELTA = boundEnd - boundBegin;

		if (BOUNDS_DELTA === 0) {
			if (progression) {
				console.warn('bounds delta is zero; progression ignored');
			}
		}
		else {
			console.assert(progression instanceof Progression);
		}

		this._typeEnum = typeEnum;
		this._boundEnd = boundEnd;
		this._boundBegin = boundBegin;
		this._progression = progression;
	}
}

let enumKey = 0;

//TODO: (low-pri) Lift all of this data out into a config file, so users can define their own model environments.
Axis.TYPE_LAYERS		= enumKey++;	Axis.TYPE_NAME_LAYERS		= 'hiddenLayers';			Axis.TYPE_DEFAULT_LAYERS	= 2;
Axis.TYPE_NEURONS		= enumKey++;	Axis.TYPE_NAME_NEURONS		= 'neuronsPerHiddenLayer';	Axis.TYPE_DEFAULT_NEURONS	= 16;
Axis.TOTAL_TYPES = enumKey;

// ensure these keys are unique for this enum, and build a lookup-name-name map while we're at it

Axis.TYPE_ENUMS_BY_NAME = {};

for (let i = 0; i < Axis.TOTAL_TYPES; ++i) {
	let key = '';

	switch (i) {
		case Axis.TYPE_LAYERS:		key = Axis.TYPE_NAME_LAYERS; break;
		case Axis.TYPE_NEURONS:		key = Axis.TYPE_NAME_NEURONS; break;

		default: {
			throw new Error('invalid enum index on check keys: ' + i + '/' + Axis.TOTAL_TYPES);
		}
	}

	if (Axis.TYPE_ENUMS_BY_NAME[key] !== undefined) {
		throw new Error('duplicate axis type key: ' + key);
	}

	Axis.TYPE_ENUMS_BY_NAME[key] = i;
}

Axis.LookupTypeName = (x) => {
	switch (x) {
		case Axis.TYPE_LAYERS:		return Axis.TYPE_NAME_LAYERS;
		case Axis.TYPE_NEURONS:		return Axis.TYPE_NAME_NEURONS;

		default: {
			throw new Error('invalid enum index: ' + x + '/' + Axis.TOTAL_TYPES);
		}
	}
};


Object.freeze(Axis);

exports.Axis = Axis;
