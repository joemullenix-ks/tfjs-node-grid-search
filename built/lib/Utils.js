'use strict';
//TODO: Merge these into the F lib, once that's integrated.
var UTILS = {
    ArrayCalculateAverage: function (array) {
        console.assert(Array.isArray(array));
        //PERF: This can be done more efficiently w/ a little math. Don't walk the whole set. Instead, discount a running average (which
        //		we'll keep separately and pass in), by (droppedSample / total), then add (newSample / total).
        var SUM = array.reduce(function (previous, current) { return previous + current; }, 0);
        return SUM / array.length;
    },
    ArrayFindIndexOfHighestValue: function (values) {
        console.assert(Array.isArray(values));
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
        if (typeof x !== 'number') {
            return false;
        }
        if (x < 0) {
            return false;
        }
        if (x !== Math.floor(x)) {
            return false;
        }
        return true;
    },
    CheckFloat0to1Exclusive: function (x) {
        if (typeof x !== 'number') {
            return false;
        }
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
        console.assert(Array.isArray(queue));
        console.assert(typeof count === 'number');
        console.assert(count > 0);
        queue.push(newSample);
        if (queue.length <= count) {
            return;
        }
        queue.shift();
    },
    ValidateTextForCSV: function (x) {
        // allows any input (that's the point; we cast to string)
        var AS_STRING = x.toString();
        if (AS_STRING.indexOf(',') === -1 && AS_STRING.indexOf('\n') === -1) {
            return;
        }
        throw new Error('Value contains comma or newline (which interferes with CSV): ' + x + ', ' + AS_STRING);
    },
    WriteDurationReport: function (durationMS) {
        console.assert(typeof durationMS === 'number');
        console.assert(durationMS >= 0);
        console.assert(durationMS === Math.floor(durationMS)); //NOTE: A bit aggressive, I suppose; drop as needed.
        //TODO: (low-pri) Bring in time-reporting from the f lib, which has smart duration-category picking.
        return (durationMS / 60 / 1000).toFixed(2) + ' min'
            + ' / '
            + (durationMS / 60 / 60 / 1000).toFixed(1) + ' hr';
    }
};
Object.freeze(UTILS);
exports.Utils = UTILS;
