'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
//TODO: Merge these into the F lib, once that's integrated.
var UTILS = {
    ArrayCalculateAverage: function (array) {
        if (array.length === 0) {
            throw new Error('Cannot calculate average. Array is empty.');
        }
        //PERF: This can be done more efficiently w/ a little math. Don't walk the whole set. Instead, discount a running average (which
        //		we'll keep separately and pass in), by (droppedSample / total), then add (newSample / total).
        var SUM = array.reduce(function (previous, current) { return previous + current; }, 0);
        return SUM / array.length;
    },
    ArrayFindIndexOfHighestValue: function (values) {
        console.assert(values.length > 0);
        var indexOfHighest = 0;
        var highestValue = Number.MIN_VALUE;
        for (var p = 0; p < values.length; ++p) {
            if (values[p] < highestValue) {
                continue;
            }
            indexOfHighest = p;
            highestValue = values[p];
        }
        return indexOfHighest;
    },
    CheckNonNegativeInteger: function (x) {
        if (x < 0) {
            return false;
        }
        if (x !== Math.floor(x)) {
            return false;
        }
        return true;
    },
    CheckFloat0to1Exclusive: function (x) {
        if (x <= 0) {
            return false;
        }
        if (x >= 1) {
            return false;
        }
        return true;
    },
    CheckPositiveInteger: function (x) {
        if (!UTILS.CheckNonNegativeInteger(x)) {
            return false;
        }
        if (x < 1) {
            return false;
        }
        return true;
    },
    QueueRotate: function (queue, newSample, count) {
        console.assert(count >= 1);
        queue.push(newSample);
        if (queue.length <= count) {
            return;
        }
        queue.shift();
    },
    ThrowCaughtUnknown: function (messagePrefix, errorOrException) {
        if (typeof errorOrException === 'string') {
            throw new Error(messagePrefix + errorOrException);
        }
        if (errorOrException instanceof Error) {
            throw new Error(messagePrefix + errorOrException.message);
        }
        throw new Error(messagePrefix + 'unknown exception type');
    },
    ValidateTextForCSV: function (x) {
        //NOTE: Add whichever (just not TS any) input type. That's the point, here. We're looking at the argument
        //		after it's been cast to string, to ensure we have cleanly CSV-able information for file write().
        var AS_STRING = x.toString();
        if (AS_STRING.indexOf(',') === -1 && AS_STRING.indexOf('\n') === -1) {
            return;
        }
        throw new Error('Value contains comma or newline (which interferes with CSV): ' + x + ', ' + AS_STRING);
    },
    WriteDurationReport: function (durationMS) {
        console.assert(durationMS >= 0);
        //TODO: (low-pri) Bring in time-reporting from the f lib, which has smart duration-category picking.
        return durationMS + ' ms'
            + ' / '
            + (durationMS / 1000).toFixed(2) + ' sec'
            + ' / '
            + (durationMS / 60 / 1000).toFixed(2) + ' min'
            + ' / '
            + (durationMS / 60 / 60 / 1000).toFixed(1) + ' hr';
    }
};
exports.Utils = UTILS;
Object.freeze(UTILS);
//# sourceMappingURL=Utils.js.map