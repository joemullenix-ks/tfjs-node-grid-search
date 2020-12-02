'use strict';


import { FailureMessage } from './FailureMessage';
import { Progression } from './Progression';
import { Utils } from './Utils';


class Axis {
	private _forward = false;
	private _typeName = '';

	constructor(private _typeEnum: number,
				private _boundBegin: number,
				private _boundEnd: number,
				private _progression: Progression) {
		console.assert(_typeEnum >= 0 && _typeEnum < Types._TOTAL);

		console.assert(_boundEnd >= 0);
		console.assert(_boundBegin >= 0);

		this._typeName = Axis.LookupTypeName(this._typeEnum);

//NOTE: Validate these bounds. Invalid input is fatal, so that users don't kick off (potentially very
//		long) grid searches with a doomed model config. It may not fail until the end.
//		Imagine this case:
//			- batchSize 100 - 0, stepped by 2
//			- plus several other axes; 1000+ combinations with say 3x repetitions
//
//		Batch size zero is invalid, and will crash TF. However, the user wouldn't find out until the grid
//		search was near its end, after hours (or days!).
//		This will nip that in the bud.
//
//		That said - we only enforce basic rules, e.g. no negative epoch counts, integer neuron counts, etc...
//		We're not attempting to do TF's job, here.
//		Nor do we project memory usage or battery life (yet).

		const FAILURE_MESSAGE = new FailureMessage();

		if (!Axis.AttemptValidateParameter(this._typeName, this._boundBegin, FAILURE_MESSAGE)) {
			throw new Error('There was a problem with an axis-begin value. ' + FAILURE_MESSAGE.text);
		}

		if (!Axis.AttemptValidateParameter(this._typeName, this._boundEnd, FAILURE_MESSAGE)) {
			throw new Error('There was a problem with an axis-end value. ' + FAILURE_MESSAGE.text);
		}

		if (!Axis.AttemptValidateProgression(this._typeName, this._progression, FAILURE_MESSAGE)) {
			throw new Error('There was a problem with an axis progression. ' + FAILURE_MESSAGE.text);
		}

		const BOUNDS_DELTA = this._boundEnd - this._boundBegin;

//NOTE: Negative deltas are supported.

		if (BOUNDS_DELTA === 0) {
			console.warn('"' + this._typeName
							+ '" has a single-step progression, because its begin and end bounds are the same.');
		}

		this._forward = BOUNDS_DELTA >= 0;
	}

	get type(): number { return this._typeEnum; }
	get typeName(): string { return this._typeName; }

	Advance(): void {
		this._progression.Advance();
	}

	CalculatePosition(): number {
		const PROGRESSION_VALUE = this._progression.value;

		return this._boundBegin + (this._forward ? PROGRESSION_VALUE : -PROGRESSION_VALUE);
	}

	CheckComplete(): boolean {
		return (this._forward
				? this.CalculatePosition() > this._boundEnd
				: this.CalculatePosition() < this._boundEnd);
	}

	Reset(): void {
		this._progression.Reset();
	}

	WriteReport(compact: boolean): string {
		const POSITION_TEXT = this._progression.integerBased
								? this.CalculatePosition()
								: this.CalculatePosition().toFixed(6);

		const REPORT_TEXT = POSITION_TEXT
							+ ' ' + this._typeName
							+ (compact
								? ''
								: (' { ' + this._boundBegin
									+ ' - '
									+ this._boundEnd + ' '
									+ this._progression.typeName + ' }'));

		return REPORT_TEXT;
	}

//NOTE: It's important to gracefully handle bad inputs here, with explanations and recommendations in the failure text.
//		This has the potential to be a point-of-failure for new users as they ramp up on model config.
	static AttemptValidateParameter(key: string, value: number, failureMessage: FailureMessage): boolean {
		let errorSuffix = '';

		switch (key) {
			case Names.BATCH_SIZE:
			case Names.EPOCHS:
			case Names.NEURONS: {
				if (Utils.CheckPositiveInteger(value)) {
					return true;
				}

				errorSuffix = ERROR_TEXT_POSITIVE_INTEGER;
			}
			break;

			case Names.LAYERS: {
				// zero is allowed
				if (Utils.CheckNonNegativeInteger(value)) {
					return true;
				}

				errorSuffix = ERROR_TEXT_NON_NEGATIVE_INTEGER;
			}
			break;

			case Names.LEARN_RATE:				// << zero and one break Adam (TODO: Not yet not confirmed, and optimizer dependent)
			case Names.VALIDATION_SPLIT: {		// << zero and one disable TF validation
				// zero and one are not allowed
				if (Utils.CheckFloat0to1Exclusive(value)) {
					return true;
				}

				errorSuffix = ERROR_TEXT_EXCLUSIVE_UNIT_SCALAR;
			}
			break;

			default: {
				errorSuffix = ERROR_TEXT_PARAM_UNKNOWN;
			}
		}

		failureMessage.text = '"' + key + '" is not valid. ' + errorSuffix;

		return false;
	}

//NOTE: It's important to gracefully handle bad inputs here, with explanations and recommendations in the failure text.
//		This has the potential to be a point-of-failure for new users as they ramp up on model config.
	static AttemptValidateProgression(key: string, progression: Progression, failureMessage: FailureMessage): boolean {
		let errorSuffix = '';

		switch (key) {
			// integer progressions, only
			case Names.BATCH_SIZE:
			case Names.EPOCHS:
			case Names.NEURONS:
			case Names.LAYERS: {
				if (progression.integerBased) {
					return true;
				}

				errorSuffix = ERROR_TEXT_POSITIVE_INTEGER;
			}
			break;

			// floating-point progressions allowed
			case Names.LEARN_RATE:
			case Names.VALIDATION_SPLIT: {
				if (!progression.integerBased) {
					return true;
				}

				errorSuffix = ERROR_TEXT_POSITIVE_FLOAT;
			}
			break;

			default: {
				errorSuffix = ERROR_TEXT_PARAM_UNKNOWN;
			}
		}

		failureMessage.text = '"' + key + '" is not valid. ' + errorSuffix;

		return false;
	}

	static LookupTypeName(x: number): string {
		switch (x) {
			case Types.BATCH_SIZE:			return Names.BATCH_SIZE;
			case Types.EPOCHS:				return Names.EPOCHS;
			case Types.LAYERS:				return Names.LAYERS;
			case Types.LEARN_RATE:			return Names.LEARN_RATE;
			case Types.NEURONS:				return Names.NEURONS;
			case Types.VALIDATION_SPLIT:	return Names.VALIDATION_SPLIT;

			default: {
				throw new Error('invalid enum index: ' + x + '/' + Types._TOTAL);
			}
		}
	}
}



/*KEEP: for a bit; see note below
interface AxisDef {
	default: number; //NOTE: This can (and likely will) could expand to include bool and string/
	name: number;
	type: number;
}
*/

//NOTE: TODO: This is wrong, I'm just not clear on the solution at the moment; need to finish the TS conversion.
//			  Obviously we should NOT have three separate enums that represent one class of information.
//  		  Either we'll have an interface that each instance of Axis takes as a constructor param,
//			  or, and I think more likely, we'll treat Axis as a base (probably abstract), then derive
//			  children for each axis (BatchSizeAxis, EpochsAxis, etc...).
//			  More to come!


//NOTE: These can (and should!) be "const enum", but that causes a failure when packaging for npm.
//		It's apparently a limitation of TypeScript. These are done are as #define in C, in that they're are
//		implemented via find-and-replace at compile time. They have no run time aliases, ergo they can't
//		be exported.
//		When they're _not_ const, apparently they have aliases. Why anyone would want an enum that isn't
//		constant is beyond me ... but there we are.
enum Defaults {
	BATCH_SIZE			= 10,
	EPOCHS				= 50,
	LAYERS				= 2,
	LEARN_RATE			= 0.001,
	NEURONS				= 16,
	VALIDATION_SPLIT	= 0.2
}

enum Names {
	BATCH_SIZE			= 'batchSize',
	EPOCHS				= 'epochs',
	LAYERS				= 'hiddenLayers',
	LEARN_RATE			= 'learnRate',
	NEURONS				= 'neuronsPerHiddenLayer',
	VALIDATION_SPLIT	= 'validationSplit'
}

enum Types {
	BATCH_SIZE = 0,
	EPOCHS,
	LAYERS,
	LEARN_RATE,
	NEURONS,
	VALIDATION_SPLIT,
	_TOTAL
}


const ERROR_TEXT_EXCLUSIVE_UNIT_SCALAR	= 'The value must be between 0 and 1 exclusive.';
const ERROR_TEXT_NON_NEGATIVE_INTEGER	= 'The value must be a non-negative integer.';
const ERROR_TEXT_PARAM_UNKNOWN			= 'The parameter is not recognized.';
const ERROR_TEXT_POSITIVE_FLOAT			= 'The value must be a positive float.';
const ERROR_TEXT_POSITIVE_INTEGER		= 'The value must be a positive integer.';


Object.freeze(Axis);

export { Axis, Defaults, Names, Types };
