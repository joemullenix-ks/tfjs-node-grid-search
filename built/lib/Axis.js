'use strict';
var FailureMessage = require('./FailureMessage').FailureMessage;
var Progression = require('./Progression').Progression;
var Utils = require('./Utils').Utils;
var Axis = /** @class */ (function () {
    function Axis(typeEnum, boundBegin, boundEnd, progression) {
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
        //		Nor can we project memory usage and battery life (yet).
        var FAILURE_MESSAGE = new FailureMessage();
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
        console.assert(typeof compact === 'boolean');
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
    return Axis;
}());
var enumKey = 0;
//TODO: (low-pri) Lift all of these out into a config file, so users can define their own model environments.
Axis.TYPE_BATCH_SIZE = enumKey++;
Axis.TYPE_NAME_BATCH_SIZE = 'batchSize';
Axis.TYPE_DEFAULT_BATCH_SIZE = 10;
Axis.TYPE_EPOCHS = enumKey++;
Axis.TYPE_NAME_EPOCHS = 'epochs';
Axis.TYPE_DEFAULT_EPOCHS = 50;
Axis.TYPE_LAYERS = enumKey++;
Axis.TYPE_NAME_LAYERS = 'hiddenLayers';
Axis.TYPE_DEFAULT_LAYERS = 2;
Axis.TYPE_LEARN_RATE = enumKey++;
Axis.TYPE_NAME_LEARN_RATE = 'learnRate';
Axis.TYPE_DEFAULT_LEARN_RATE = 0.001;
Axis.TYPE_NEURONS = enumKey++;
Axis.TYPE_NAME_NEURONS = 'neuronsPerHiddenLayer';
Axis.TYPE_DEFAULT_NEURONS = 16;
Axis.TYPE_VALIDATION_SPLIT = enumKey++;
Axis.TYPE_NAME_VALIDATION_SPLIT = 'validationSplit';
Axis.TYPE_DEFAULT_VALIDATION_SPLIT = 0.2;
Axis.TOTAL_TYPES = enumKey;
// ensure these keys are unique for this enum, and build a lookup-name-name map while we're at it
Axis.TYPE_ENUMS_BY_NAME = {};
for (var i = 0; i < Axis.TOTAL_TYPES; ++i) {
    var key = '';
    switch (i) {
        case Axis.TYPE_BATCH_SIZE:
            key = Axis.TYPE_NAME_BATCH_SIZE;
            break;
        case Axis.TYPE_EPOCHS:
            key = Axis.TYPE_NAME_EPOCHS;
            break;
        case Axis.TYPE_LAYERS:
            key = Axis.TYPE_NAME_LAYERS;
            break;
        case Axis.TYPE_LEARN_RATE:
            key = Axis.TYPE_NAME_LEARN_RATE;
            break;
        case Axis.TYPE_NEURONS:
            key = Axis.TYPE_NAME_NEURONS;
            break;
        case Axis.TYPE_VALIDATION_SPLIT:
            key = Axis.TYPE_NAME_VALIDATION_SPLIT;
            break;
        default: {
            throw new Error('invalid enum index on check keys: ' + i + '/' + Axis.TOTAL_TYPES);
        }
    }
    if (Axis.TYPE_ENUMS_BY_NAME[key] !== undefined) {
        throw new Error('duplicate axis type key: ' + key);
    }
    Axis.TYPE_ENUMS_BY_NAME[key] = i;
}
Axis.LookupTypeName = function (x) {
    switch (x) {
        case Axis.TYPE_BATCH_SIZE: return Axis.TYPE_NAME_BATCH_SIZE;
        case Axis.TYPE_EPOCHS: return Axis.TYPE_NAME_EPOCHS;
        case Axis.TYPE_LAYERS: return Axis.TYPE_NAME_LAYERS;
        case Axis.TYPE_LEARN_RATE: return Axis.TYPE_NAME_LEARN_RATE;
        case Axis.TYPE_NEURONS: return Axis.TYPE_NAME_NEURONS;
        case Axis.TYPE_VALIDATION_SPLIT: return Axis.TYPE_NAME_VALIDATION_SPLIT;
        default: {
            throw new Error('invalid enum index: ' + x + '/' + Axis.TOTAL_TYPES);
        }
    }
};
var ERROR_TEXT_EXCLUSIVE_UNIT_SCALAR = 'The value must be between 0 and 1 exclusive.';
var ERROR_TEXT_NON_NEGATIVE_INTEGER = 'The value must be a non-negative integer.';
var ERROR_TEXT_PARAM_UNKNOWN = 'The parameter is not recognized.';
var ERROR_TEXT_POSITIVE_FLOAT = 'The value must be a positive float.';
var ERROR_TEXT_POSITIVE_INTEGER = 'The value must be a positive integer.';
Axis.AttemptValidateParameter = function (key, value, failureMessage) {
    console.assert(failureMessage instanceof FailureMessage);
    //NOTE: It's important to gracefully handle bad inputs here, with explanations and recommendations in the failure text.
    //		This has the potential to be a point-of-failure for new users ramping up on model config.
    var errorSuffix = '';
    switch (key) {
        case Axis.TYPE_NAME_BATCH_SIZE:
        case Axis.TYPE_NAME_EPOCHS:
        case Axis.TYPE_NAME_NEURONS:
            {
                if (Utils.CheckPositiveInteger(value)) {
                    return true;
                }
                errorSuffix = ERROR_TEXT_POSITIVE_INTEGER;
            }
            break;
        case Axis.TYPE_NAME_LAYERS:
            {
                // zero is allowed
                if (Utils.CheckNonNegativeInteger(value)) {
                    return true;
                }
                errorSuffix = ERROR_TEXT_NON_NEGATIVE_INTEGER;
            }
            break;
        case Axis.TYPE_NAME_LEARN_RATE: // << zero and one break Adam (TODO: Not yet not confirmed, and optimizer dependent)
        case Axis.TYPE_NAME_VALIDATION_SPLIT:
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
};
Axis.AttemptValidateProgression = function (key, progression, failureMessage) {
    console.assert(failureMessage instanceof FailureMessage);
    //NOTE: It's important to gracefully handle bad inputs here, with explanations and recommendations in the failure text.
    //		This has the potential to be a point-of-failure for new users ramping up on model config.
    var errorSuffix = '';
    switch (key) {
        // integer progressions, only
        case Axis.TYPE_NAME_BATCH_SIZE:
        case Axis.TYPE_NAME_EPOCHS:
        case Axis.TYPE_NAME_NEURONS:
        case Axis.TYPE_NAME_LAYERS:
            {
                if (progression.integerBased) {
                    return true;
                }
                errorSuffix = ERROR_TEXT_POSITIVE_INTEGER;
            }
            break;
        // floating-point progressions allowed
        case Axis.TYPE_NAME_LEARN_RATE:
        case Axis.TYPE_NAME_VALIDATION_SPLIT: {
            if (!progression.integerBased) {
                return true;
            }
            errorSuffix = ERROR_TEXT_POSITIVE_FLOAT;
        }
        default: {
            errorSuffix = ERROR_TEXT_PARAM_UNKNOWN;
        }
    }
    failureMessage.text = '"' + key + '" is not valid. ' + errorSuffix;
    return false;
};
Object.freeze(Axis);
exports.Axis = Axis;
//# sourceMappingURL=Axis.js.map