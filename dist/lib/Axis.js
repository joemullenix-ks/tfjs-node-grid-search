'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Axis = void 0;
var FailureMessage_1 = require("./FailureMessage");
var Utils_1 = require("./Utils");
var Axis = /** @class */ (function () {
    function Axis(_typeEnum, _boundBegin, _boundEnd, _progression) {
        this._typeEnum = _typeEnum;
        this._boundBegin = _boundBegin;
        this._boundEnd = _boundEnd;
        this._progression = _progression;
        this._forward = false;
        this._typeName = '';
        console.assert(_typeEnum >= 0 && _typeEnum < 6 /* _TOTAL */);
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
        var FAILURE_MESSAGE = new FailureMessage_1.FailureMessage();
        if (!Axis.AttemptValidateParameter(this._typeName, this._boundBegin, FAILURE_MESSAGE)) {
            throw new Error('There was a problem with an axis-begin value. ' + FAILURE_MESSAGE.text);
        }
        if (!Axis.AttemptValidateParameter(this._typeName, this._boundEnd, FAILURE_MESSAGE)) {
            throw new Error('There was a problem with an axis-end value. ' + FAILURE_MESSAGE.text);
        }
        if (!Axis.AttemptValidateProgression(this._typeName, this._progression, FAILURE_MESSAGE)) {
            throw new Error('There was a problem with an axis progression. ' + FAILURE_MESSAGE.text);
        }
        var BOUNDS_DELTA = this._boundEnd - this._boundBegin;
        //NOTE: Negative deltas are supported.
        if (BOUNDS_DELTA === 0) {
            console.warn('"' + this._typeName
                + '" has a single-step progression, because its begin and end bounds are the same.');
        }
        this._forward = BOUNDS_DELTA >= 0;
    }
    Object.defineProperty(Axis.prototype, "type", {
        get: function () { return this._typeEnum; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "typeName", {
        get: function () { return this._typeName; },
        enumerable: false,
        configurable: true
    });
    Axis.prototype.Advance = function () {
        this._progression.Advance();
    };
    Axis.prototype.CalculatePosition = function () {
        var PROGRESSION_VALUE = this._progression.value;
        return this._boundBegin + (this._forward ? PROGRESSION_VALUE : -PROGRESSION_VALUE);
    };
    Axis.prototype.CheckComplete = function () {
        return (this._forward
            ? this.CalculatePosition() > this._boundEnd
            : this.CalculatePosition() < this._boundEnd);
    };
    Axis.prototype.Reset = function () {
        this._progression.Reset();
    };
    Axis.prototype.WriteReport = function (compact) {
        var POSITION_TEXT = this._progression.integerBased
            ? this.CalculatePosition()
            : this.CalculatePosition().toFixed(6);
        var REPORT_TEXT = POSITION_TEXT
            + ' ' + this._typeName
            + (compact
                ? ''
                : (' { ' + this._boundBegin
                    + ' - '
                    + this._boundEnd + ' '
                    + this._progression.typeName + ' }'));
        return REPORT_TEXT;
    };
    //NOTE: It's important to gracefully handle bad inputs here, with explanations and recommendations in the failure text.
    //		This has the potential to be a point-of-failure for new users as they ramp up on model config.
    Axis.AttemptValidateParameter = function (key, value, failureMessage) {
        var errorSuffix = '';
        switch (key) {
            case "batchSize" /* BATCH_SIZE */:
            case "epochs" /* EPOCHS */:
            case "neuronsPerHiddenLayer" /* NEURONS */:
                {
                    if (Utils_1.Utils.CheckPositiveInteger(value)) {
                        return true;
                    }
                    errorSuffix = ERROR_TEXT_POSITIVE_INTEGER;
                }
                break;
            case "hiddenLayers" /* LAYERS */:
                {
                    // zero is allowed
                    if (Utils_1.Utils.CheckNonNegativeInteger(value)) {
                        return true;
                    }
                    errorSuffix = ERROR_TEXT_NON_NEGATIVE_INTEGER;
                }
                break;
            case "learnRate" /* LEARN_RATE */: // << zero and one break Adam (TODO: Not yet not confirmed, and optimizer dependent)
            case "validationSplit" /* VALIDATION_SPLIT */:
                { // << zero and one disable TF validation
                    // zero and one are not allowed
                    if (Utils_1.Utils.CheckFloat0to1Exclusive(value)) {
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
    };
    //NOTE: It's important to gracefully handle bad inputs here, with explanations and recommendations in the failure text.
    //		This has the potential to be a point-of-failure for new users as they ramp up on model config.
    Axis.AttemptValidateProgression = function (key, progression, failureMessage) {
        var errorSuffix = '';
        switch (key) {
            // integer progressions, only
            case "batchSize" /* BATCH_SIZE */:
            case "epochs" /* EPOCHS */:
            case "neuronsPerHiddenLayer" /* NEURONS */:
            case "hiddenLayers" /* LAYERS */:
                {
                    if (progression.integerBased) {
                        return true;
                    }
                    errorSuffix = ERROR_TEXT_POSITIVE_INTEGER;
                }
                break;
            // floating-point progressions allowed
            case "learnRate" /* LEARN_RATE */:
            case "validationSplit" /* VALIDATION_SPLIT */:
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
    };
    Axis.LookupTypeName = function (x) {
        switch (x) {
            case 0 /* BATCH_SIZE */: return "batchSize" /* BATCH_SIZE */;
            case 1 /* EPOCHS */: return "epochs" /* EPOCHS */;
            case 2 /* LAYERS */: return "hiddenLayers" /* LAYERS */;
            case 3 /* LEARN_RATE */: return "learnRate" /* LEARN_RATE */;
            case 4 /* NEURONS */: return "neuronsPerHiddenLayer" /* NEURONS */;
            case 5 /* VALIDATION_SPLIT */: return "validationSplit" /* VALIDATION_SPLIT */;
            default: {
                throw new Error('invalid enum index: ' + x + '/' + 6 /* _TOTAL */);
            }
        }
    };
    return Axis;
}());
exports.Axis = Axis;
var ERROR_TEXT_EXCLUSIVE_UNIT_SCALAR = 'The value must be between 0 and 1 exclusive.';
var ERROR_TEXT_NON_NEGATIVE_INTEGER = 'The value must be a non-negative integer.';
var ERROR_TEXT_PARAM_UNKNOWN = 'The parameter is not recognized.';
var ERROR_TEXT_POSITIVE_FLOAT = 'The value must be a positive float.';
var ERROR_TEXT_POSITIVE_INTEGER = 'The value must be a positive integer.';
Object.freeze(Axis);
//# sourceMappingURL=Axis.js.map