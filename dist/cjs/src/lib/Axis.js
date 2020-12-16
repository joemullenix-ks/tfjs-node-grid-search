'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxisTypes = exports.AxisNames = exports.AxisDefaults = exports.Axis = void 0;
const FailureMessage_1 = require("./FailureMessage");
const Utils = __importStar(require("./Utils"));
/**
 * Manages one hyperparameter over the course of the search.
 * It uses a bounded range, and a progression across that range, to define
 * a set of steps. A model is trained and tested at each step.
 * Positions along the axis are defined as the sum of _boundBegin and
 * _progression's current value. When this sum is greather than _boundEnd,
 * the axis is complete.
 * @example
 * // create an axis for the hyperparameter 'batch size', with a range of {8, 12, 16}
 * new tngs.Axis(tngs.AxisTypes.BATCH_SIZE,
 *               8,
 *               16,
 *               new tngs.LinearProgression(4))
 */
class Axis {
    /**
    * Creates an instance of Axis.
    * @param {number} _typeEnum The hyperparameter associated with this axis.
    *							Must be a member of the [AxisTypes]{@link Axis.AxisTypes} enum.
    * @param {number} _boundBegin The start of the search range, inclusive.
    * @param {number} _boundEnd The end of the search range, inclusive.
    * @param {Progression} _progression Provides a set of offsets used to
    *									determine the steps in the range.
    */
    constructor(_typeEnum, _boundBegin, _boundEnd, _progression) {
        this._typeEnum = _typeEnum;
        this._boundBegin = _boundBegin;
        this._boundEnd = _boundEnd;
        this._progression = _progression;
        this._forward = false;
        this._typeName = '';
        Utils.Assert(_typeEnum >= 0 && _typeEnum < AxisTypes._TOTAL);
        Utils.Assert(_boundEnd >= 0);
        Utils.Assert(_boundBegin >= 0);
        this._typeName = Axis.LookupTypeName(this._typeEnum);
        //NOTE: We strictly validate these bounds. Invalid input is fatal, so that users don't kick off (potentially
        //		very long) grid searches with a doomed model config. It may not fail until the end.
        //		Imagine this case:
        //			- batchSize 100 >> 0, stepped by 2, for a range of {100, 98, 96, ..., 0}
        //			- a second axis with 10 values, producing 1,010 combinations
        //			- three repetitions per combination, producing 3,030 unique models
        //
        //		Batch size zero is invalid, and will crash TF. However, the user would NOT find out until the grid
        //		search was near its end, after hours (or days!).
        //		This will nip that in the bud.
        //
        //		That said - we only enforce basic rules, e.g. no negative epoch counts, integer neuron counts, etc...
        //		We're not attempting to do TF's job, here.
        //		Nor do we project memory usage or battery life (yet).
        const FAILURE_MESSAGE = new FailureMessage_1.FailureMessage();
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
    get type() { return this._typeEnum; }
    get typeName() { return this._typeName; }
    /**
    * Moves the progression to its next position.
    */
    Advance() {
        this._progression.Advance();
    }
    /**
     * Gets the current value of this axis, defined as (_boundBegin +
     * _progression.value).
     * @return {number} The hyperparameter's value in the active model.
     */
    CalculatePosition() {
        const PROGRESSION_VALUE = this._progression.value;
        return this._boundBegin + (this._forward ? PROGRESSION_VALUE : -PROGRESSION_VALUE);
    }
    /**
     * Determines whether this axis is at or beyond the end of its range.
     * @return {boolean}
     */
    CheckComplete() {
        return (this._forward
            ? this.CalculatePosition() > this._boundEnd
            : this.CalculatePosition() < this._boundEnd);
    }
    /**
     * Moves the progression to its initial position.
     */
    Reset() {
        this._progression.Reset();
    }
    /**
    * Gets a description of the axis's type and position. Set 'compact' to false
    * for details on the progression.
    * @param {boolean} compact If false, bounds and progression are included.
    * @return {string}
    */
    WriteReport(compact) {
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
    /**
     * Checks whether a begin/end boundary is valid for a given hyperparameter.
     * Writes an informative message for the user, in the event of failure.
     * @static
     * @param {string} key Must match an entry in the [AxisNames]{@link Axis.AxisNames} enum.
     * @param {number} value The number to validated against this hyperparameter.
     * @param {FailureMessage} failureMessage Explanatory faliure text is written to this object.
     * @return {boolean}
     */
    static AttemptValidateParameter(key, value, failureMessage) {
        //NOTE: It's important to gracefully handle bad inputs here, with explanations and recommendations in the failure text.
        //		This has the potential to be a point-of-failure for new users as they ramp up on model config.
        let errorSuffix = '';
        switch (key) {
            case AxisNames.BATCH_SIZE:
            case AxisNames.EPOCHS:
            case AxisNames.NEURONS:
                {
                    if (Utils.CheckPositiveInteger(value)) {
                        return true;
                    }
                    errorSuffix = ERROR_TEXT_POSITIVE_INTEGER;
                }
                break;
            case AxisNames.LAYERS:
                {
                    // zero is allowed
                    if (Utils.CheckNonNegativeInteger(value)) {
                        return true;
                    }
                    errorSuffix = ERROR_TEXT_NON_NEGATIVE_INTEGER;
                }
                break;
            case AxisNames.LEARN_RATE: // << zero and one break Adam (TODO: Not yet not confirmed, and optimizer dependent)
            case AxisNames.VALIDATION_SPLIT:
                { // << zero and one disable TF validation
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
    /**
     * Checks whether a progression's config is valid for a given hyperparameter.
     * Writes an informative message for the user, in the event of failure.
     * @static
     * @param {string} key Must match an entry in the [AxisNames]{@link Axis.AxisNames} enum.
     * @param {Progression} progression A concrete instance derived from Progression.
     * @param {FailureMessage} failureMessage Explanatory faliure text is written to this object.

     * @return {boolean}
     */
    static AttemptValidateProgression(key, progression, failureMessage) {
        //NOTE: It's important to gracefully handle bad inputs here, with explanations and recommendations in the failure text.
        //		This has the potential to be a point-of-failure for new users as they ramp up on model config.
        let errorSuffix = '';
        switch (key) {
            // integer progressions, only
            case AxisNames.BATCH_SIZE:
            case AxisNames.EPOCHS:
            case AxisNames.NEURONS:
            case AxisNames.LAYERS:
                {
                    if (progression.integerBased) {
                        return true;
                    }
                    errorSuffix = ERROR_TEXT_POSITIVE_INTEGER;
                }
                break;
            // floating-point progressions allowed
            case AxisNames.LEARN_RATE:
            case AxisNames.VALIDATION_SPLIT:
                {
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
    /**
     * Takes an entry from the [AxisTypes]{@link Axis.AxisTypes} enum, and return its associated name.
     * @static
     * @param {number} type An entry from the [AxisTypes]{@link Axis.AxisTypes} enum.
     * @return {string} An entry from the [AxisNames]{@link Axis.AxisNames} enum.
     */
    static LookupTypeName(type) {
        switch (type) {
            case AxisTypes.BATCH_SIZE: return AxisNames.BATCH_SIZE;
            case AxisTypes.EPOCHS: return AxisNames.EPOCHS;
            case AxisTypes.LAYERS: return AxisNames.LAYERS;
            case AxisTypes.LEARN_RATE: return AxisNames.LEARN_RATE;
            case AxisTypes.NEURONS: return AxisNames.NEURONS;
            case AxisTypes.VALIDATION_SPLIT: return AxisNames.VALIDATION_SPLIT;
            default: {
                throw new Error('invalid enum index: ' + type + '/' + AxisTypes._TOTAL);
            }
        }
    }
}
exports.Axis = Axis;
//NOTE: TODO: These enums are wrong, and will be reconstructed after the current project-upgrades pass.
//			  Obviously we should NOT have three separate enums that represent one class of information.
//  		  Either we'll have an interface that each instance of Axis takes as a constructor param,
//			  or, and I think more likely, we'll treat Axis as a base (probably abstract), then derive
//			  concrete subs (e.g. BatchSizeAxis, EpochsAxis, etc...).
//
//			  Something like this:
//	 			interface AxisDef {
// 					default: number; << or bool|number|string? ...and callbacks? Look through TF::Model's types.
// 					name: number;
// 					type: number;
// 				}
//
//			  ...more to come!
//NOTE: These can (and should!) be "const enum", but that causes a failure when packaging for npm. Further, the
//		TypeScript enum doesn't get exported (in any useful way) by JSDoc, thus this hodgepodge workaround.
//		The const issue is a limitation of TypeScript. Enums are preprocessor'd, like #define in C. They're
//		implemented pre-transpile, and have no run time aliases, ergo they can't be exported.
//		When they're _not_ const, apparently they have aliases. Why anyone would want an enum that isn't
//		constant is beyond me ... but there we are.
/**
 * Enumeration of the hyperparameter default values.<br>
 * See [AxisTypes]{@link Axis.AxisTypes} for details on each hyperparameter.
 * @enum {number}
 * @memberof Axis
 */
const AxisDefaults = {
    /** 10 */
    BATCH_SIZE: 10,
    /** 50 */
    EPOCHS: 50,
    /** 2 */
    LAYERS: 2,
    /** 0.001 */
    LEARN_RATE: 0.001,
    /** 16 */
    NEURONS: 16,
    /** 0.2 */
    VALIDATION_SPLIT: 0.2
};
exports.AxisDefaults = AxisDefaults;
Object.freeze(AxisDefaults);
/**
 * Enumeration of the hyperparameter names.<br>
 * See [AxisTypes]{@link Axis.AxisTypes} for details on each hyperparameter.
 * @enum {string}
 * @memberof Axis
 */
const AxisNames = {
    /** batchSize */
    BATCH_SIZE: 'batchSize',
    /** epochs */
    EPOCHS: 'epochs',
    /** hiddenLayers */
    LAYERS: 'hiddenLayers',
    /** learnRate */
    LEARN_RATE: 'learnRate',
    /** neuronsPerHiddenLayer */
    NEURONS: 'neuronsPerHiddenLayer',
    /** validationSplit */
    VALIDATION_SPLIT: 'validationSplit'
};
exports.AxisNames = AxisNames;
Object.freeze(AxisNames);
/**
 * Enumeration of the hyperparameters currently supported in TNGS.
 * @enum {number}
 * @memberof Axis
 */
const AxisTypes = {
    /**
     * See args in {@link https://js.tensorflow.org/api/latest/#tf.Sequential.fit}
     */
    BATCH_SIZE: 0,
    /**
     * See args in {@link https://js.tensorflow.org/api/latest/#tf.Sequential.fit}
     */
    EPOCHS: 1,
    /**
     * The number of hidden layers in the model.
     * See {@link https://en.wikipedia.org/wiki/Artificial_neural_network}
     */
    LAYERS: 2,
    /**
     * See {@link https://js.tensorflow.org/api/latest/#train.adam}
     * NOTE: Currently Adam is only supported optimizer.
     */
    LEARN_RATE: 3,
    /**
     * See {@link https://en.wikipedia.org/wiki/Artificial_neural_network}
     * NOTE: All hidden layers currently use a fixed neuron count.
     */
    NEURONS: 4,
    /**
     * See args in {@link https://js.tensorflow.org/api/latest/#tf.Sequential.fit}
     */
    VALIDATION_SPLIT: 5,
    /**
     * Enum length
     */
    _TOTAL: 6
};
exports.AxisTypes = AxisTypes;
Object.freeze(AxisTypes);
const ERROR_TEXT_EXCLUSIVE_UNIT_SCALAR = 'The value must be between 0 and 1 exclusive.';
const ERROR_TEXT_NON_NEGATIVE_INTEGER = 'The value must be a non-negative integer.';
const ERROR_TEXT_PARAM_UNKNOWN = 'The parameter is not recognized.';
const ERROR_TEXT_POSITIVE_FLOAT = 'The value must be a positive float.';
const ERROR_TEXT_POSITIVE_INTEGER = 'The value must be a positive integer.';
Object.freeze(Axis);
//# sourceMappingURL=Axis.js.map