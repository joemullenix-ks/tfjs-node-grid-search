'use strict';


const { Progression } = require('./Progression');


class Axis {
	constructor(typeEnum, boundBegin, boundEnd, progression) {
		console.assert(typeof typeEnum === 'number');
		console.assert(typeEnum >= 0 && typeEnum < Axis.TOTAL_TYPES);

		console.assert(typeof boundEnd === 'number');
		console.assert(typeof boundBegin === 'number');

		console.assert(boundEnd >= 0);
		console.assert(boundBegin >= 0);

		console.assert(progression instanceof Progression);

		this._typeEnum = typeEnum;
		this._boundEnd = boundEnd;
		this._boundBegin = boundBegin;
		this._progression = progression;

		this._typeName = Axis.LookupTypeName(this._typeEnum);

		const BOUNDS_DELTA = this._boundEnd - this._boundBegin;

		if (BOUNDS_DELTA === 0) {
			console.warn('"' + this._typeName
							+ '" has a single-step progression, because its begin and end bounds are the same.');
		}

		this._forward = BOUNDS_DELTA >= 0;
	}

	Advance() {
		this._progression.Advance();
	}

	CalculatePosition() {
		const PROGRESSION_VALUE = this._progression.GetValue();

		return this._boundBegin + (this._forward ? PROGRESSION_VALUE : - PROGRESSION_VALUE);
	}

	CheckComplete() {
		return (this._forward
				? this.CalculatePosition() > this._boundEnd
				: this.CalculatePosition() < this._boundEnd);
	}

	GetType() {
		return this._typeEnum;
	}

	GetTypeName() {
		return this._typeName;
	}

	Reset() {
		this._progression.Reset();
	}

	WriteReport(compact) {
		console.assert(typeof compact === 'boolean');

		const POSITION_TEXT = this._progression.clampToInt
								? this.CalculatePosition()
								: this.CalculatePosition().toFixed(3);

		const REPORT_TEXT = POSITION_TEXT
							+ ' ' + this._typeName
							+ (compact
								? ''
								: (' { ' + this._boundBegin
									+ ' - '
									+ this._boundEnd + ' '
									+ this._progression.GetTypeName() + ' }'));

		return REPORT_TEXT;
	}
}

let enumKey = 0;

//TODO: (low-pri) Lift all of these out into a config file, so users can define their own model environments.
Axis.TYPE_BATCH_SIZE		= enumKey++;	Axis.TYPE_NAME_BATCH_SIZE		= 'batchSize';				Axis.TYPE_DEFAULT_BATCH_SIZE		= 10;
Axis.TYPE_EPOCHS			= enumKey++;	Axis.TYPE_NAME_EPOCHS			= 'epochs';					Axis.TYPE_DEFAULT_EPOCHS			= 50;
Axis.TYPE_LAYERS			= enumKey++;	Axis.TYPE_NAME_LAYERS			= 'hiddenLayers';			Axis.TYPE_DEFAULT_LAYERS			= 2;
Axis.TYPE_NEURONS			= enumKey++;	Axis.TYPE_NAME_NEURONS			= 'neuronsPerHiddenLayer';	Axis.TYPE_DEFAULT_NEURONS			= 16;
Axis.TYPE_VALIDATION_SPLIT	= enumKey++;	Axis.TYPE_NAME_VALIDATION_SPLIT	= 'validationSplit';		Axis.TYPE_DEFAULT_VALIDATION_SPLIT	= 0.2;
Axis.TOTAL_TYPES = enumKey;

// ensure these keys are unique for this enum, and build a lookup-name-name map while we're at it

Axis.TYPE_ENUMS_BY_NAME = {};

for (let i = 0; i < Axis.TOTAL_TYPES; ++i) {
	let key = '';

	switch (i) {
		case Axis.TYPE_BATCH_SIZE:			key = Axis.TYPE_NAME_BATCH_SIZE; break;
		case Axis.TYPE_EPOCHS:				key = Axis.TYPE_NAME_EPOCHS; break;
		case Axis.TYPE_LAYERS:				key = Axis.TYPE_NAME_LAYERS; break;
		case Axis.TYPE_NEURONS:				key = Axis.TYPE_NAME_NEURONS; break;
		case Axis.TYPE_VALIDATION_SPLIT:	key = Axis.TYPE_NAME_VALIDATION_SPLIT; break;

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
		case Axis.TYPE_BATCH_SIZE:			return Axis.TYPE_NAME_BATCH_SIZE;
		case Axis.TYPE_EPOCHS:				return Axis.TYPE_NAME_EPOCHS;
		case Axis.TYPE_LAYERS:				return Axis.TYPE_NAME_LAYERS;
		case Axis.TYPE_NEURONS:				return Axis.TYPE_NAME_NEURONS;
		case Axis.TYPE_VALIDATION_SPLIT:	return Axis.TYPE_NAME_VALIDATION_SPLIT;

		default: {
			throw new Error('invalid enum index: ' + x + '/' + Axis.TOTAL_TYPES);
		}
	}
};


Object.freeze(Axis);

exports.Axis = Axis;
