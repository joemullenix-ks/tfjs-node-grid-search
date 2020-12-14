'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteDurationReport = exports.ValidateTextForCSV = exports.ThrowCaughtUnknown = exports.QueueRotate = exports.CheckPositiveInteger = exports.CheckFloat0to1Exclusive = exports.CheckNonNegativeInteger = exports.Assert = exports.ArrayFindIndexOfHighestValue = exports.ArrayCalculateAverage = void 0;
//TODO: Merge these into the f lib, once that's integrated.
/**
 * @module Utils
 */
/**
 * Finds the mean of a set of numbers. Array must not be empty.
 * @param {Array<number>} array
 * @return {number}
 */
const ArrayCalculateAverage = (array) => {
    if (array.length === 0) {
        throw new Error('Cannot calculate average. Array is empty.');
    }
    //TODO: Move into EpochStats, where these can be done more efficiently.
    //PERF: Don't walk the whole set. Instead, discount a running average (which
    //		we'll keep separately and pass in), by (droppedSample / total), then
    //		add (addedSample / total).
    const SUM = array.reduce((previous, current) => { return previous + current; }, 0);
    return SUM / array.length;
};
exports.ArrayCalculateAverage = ArrayCalculateAverage;
/**
 * Finds the largest value in an array of numbers, and returns the index of that
 * value. Array must not be empty.
 * @param {Array<number>} values
 * @return {number}
 */
const ArrayFindIndexOfHighestValue = (values) => {
    if (values.length === 0) {
        throw new Error('Cannot find highest. Array is empty.');
    }
    let indexOfHighest = 0;
    let highestValue = Number.MIN_VALUE;
    for (let p = 0; p < values.length; ++p) {
        if (values[p] < highestValue) {
            continue;
        }
        indexOfHighest = p;
        highestValue = values[p];
    }
    return indexOfHighest;
};
exports.ArrayFindIndexOfHighestValue = ArrayFindIndexOfHighestValue;
/**
 * Standard assertion. Throws if condition is false.<br>
 * Note: Todo: To better merge w/ Jest, I'll propagate this throughout, and
 * build in a preprocessor switch, driven by Node launch arg.
 * @param {boolean} condition
 * @return {void}
 */
const Assert = (condition) => {
    if (condition) {
        return;
    }
    throw new Error('assertion failed');
};
exports.Assert = Assert;
/**
 * Returns true if x is in the range { 0 < x < 1 }.
 * @param {number} x
 * @return {boolean}
 */
const CheckFloat0to1Exclusive = (x) => {
    if (x <= 0) {
        return false;
    }
    if (x >= 1) {
        return false;
    }
    return true;
};
exports.CheckFloat0to1Exclusive = CheckFloat0to1Exclusive;
/**
 * Returns true if x is a positive integer or zero.
 * @param {number} x
 * @return {boolean}
 */
const CheckNonNegativeInteger = (x) => {
    if (x < 0) {
        return false;
    }
    if (x !== Math.floor(x)) {
        return false;
    }
    return true;
};
exports.CheckNonNegativeInteger = CheckNonNegativeInteger;
/**
 * Returns true if x is an integer greater than zero.
 * @param {number} x
 * @return {boolean}
 */
const CheckPositiveInteger = (x) => {
    if (!CheckNonNegativeInteger(x)) {
        return false;
    }
    if (x < 1) {
        return false;
    }
    return true;
};
exports.CheckPositiveInteger = CheckPositiveInteger;
/**
 * Fills a queue with numbers up to a length limit. Once that limit has been
 * reached, it drops the oldest first (does a dequeue before the enqueue).
 * @param {Array<number>} queue The set of numbers.
 * @param {number} newSample The number to add.
 * @param {number} count The queue max-size limit.
 */
const QueueRotate = (queue, newSample, count) => {
    if (count < 1) {
        throw new Error('queue length limit must be >= 1 :' + count);
    }
    queue.push(newSample);
    if (queue.length <= count) {
        return;
    }
    queue.shift();
};
exports.QueueRotate = QueueRotate;
/**
 * Throws a relayed exception, with logic that checks the type of the
 * caught object in order produce a cleaner error message.<br>
 * Note: This is done because TypeScript does not yet have typed catch().
 * @param {string} messagePrefix A short message to prepend to the thrown error.
 * @param {unknown} errorOrException The object originally caught.
 */
const ThrowCaughtUnknown = (messagePrefix, errorOrException) => {
    if (typeof errorOrException === 'string') {
        throw new Error(messagePrefix + errorOrException);
    }
    if (errorOrException instanceof Error) {
        throw new Error(messagePrefix + errorOrException.message);
    }
    throw new Error(messagePrefix + 'unknown exception type');
};
exports.ThrowCaughtUnknown = ThrowCaughtUnknown;
/**
 * Takes arguments in a variety of types, converts them to strings, and checks
 * whether those string representations will break CSV formatting. Specifically,
 * it throws in the event it finds a comma or newline. Otherwise it returns
 * silently.
 * @param {(string | number | boolean)} x
 */
const ValidateTextForCSV = (x) => {
    //NOTE: Add whichever (just not TS any) input type. That's the point, here. We're looking at the argument
    //		after it's been cast to string, to ensure we have cleanly CSV-able information for file write().
    //
    //UPDATE: Now that this takes primitives only, it should likely be string-only.
    //		  There is a growing case to toss it entirely. Stay tuned for the
    //		  complex axes (e.g. activation functions, etc...).
    const AS_STRING = x.toString();
    if (AS_STRING.indexOf(',') === -1 && AS_STRING.indexOf('\n') === -1) {
        return;
    }
    throw new Error('Value contains comma or newline (which interferes with CSV): ' + x + ', ' + AS_STRING);
};
exports.ValidateTextForCSV = ValidateTextForCSV;
/**
 * Creates a string that represents a duration in milliseconds, and variations
 * of the same in seconds, minutes and hours.
 * @param {number} durationMS The time in milliseconds
 * @return {string} Example: "15000 ms / 15.00 sec / 0.25 min / 0.0 hr"
 */
const WriteDurationReport = (durationMS) => {
    Assert(durationMS >= 0);
    //TODO: (low-pri) Bring in time-reporting from the f lib, which has smart duration-category picking.
    return durationMS + ' ms'
        + ' / '
        + (durationMS / 1000).toFixed(2) + ' sec'
        + ' / '
        + (durationMS / 60 / 1000).toFixed(2) + ' min'
        + ' / '
        + (durationMS / 60 / 60 / 1000).toFixed(1) + ' hr';
};
exports.WriteDurationReport = WriteDurationReport;
//# sourceMappingURL=Utils.js.map