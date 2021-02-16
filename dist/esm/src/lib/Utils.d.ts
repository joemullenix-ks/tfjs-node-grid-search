/**
 * @module Utils
 */
/**
 * Finds the mean of a set of numbers. Array must not be empty.
 * @param {Array<number>} array
 * @return {number}
 */
declare const ArrayCalculateAverage: (array: Array<number>) => number;
/**
 * Finds the largest value in an array of numbers, and returns the index of that
 * value, e.g. [1, 3, 2] returns 1. Array must not be empty.
 * @param {Array<number>} values
 * @return {number}
 */
declare const ArrayFindIndexOfHighestValue: (values: Array<number>) => number;
/**
 * Standard assertion. Throws if condition is false.<br>
 * Note: Todo: To better merge w/ Jest, I'll propagate this throughout, and
 * build in a preprocessor switch, driven by Node launch arg.
 * @param {boolean} condition
 * @return {void}
 */
declare const Assert: (condition: boolean) => void;
/**
 * Returns true if x is in the range { 0 < x < 1 }.
 * @param {number} x
 * @return {boolean}
 */
declare const CheckFloat0to1Exclusive: (x: number) => boolean;
/**
 * Returns true if x is a positive integer or zero.
 * @param {number} x
 * @return {boolean}
 */
declare const CheckNonNegativeInteger: (x: number) => boolean;
/**
 * Returns true if x is an integer greater than zero.
 * @param {number} x
 * @return {boolean}
 */
declare const CheckPositiveInteger: (x: number) => boolean;
/**
 * Fills a queue with numbers up to a length limit. Once that limit has been
 * reached, it drops the oldest first (does a dequeue before the enqueue).
 * @param {Array<number>} queue The set of numbers.
 * @param {number} newSample The number to add.
 * @param {number} count The queue max-size limit.
 */
declare const QueueRotate: (queue: Array<number>, newSample: number, count: number) => void;
/**
 * Throws a relayed exception, with logic that checks the type of the
 * caught object in order produce a cleaner error message.<br>
 * Note: This is done because TypeScript does not yet have typed catch().
 * @param {string} messagePrefix A short message to prepend to the thrown error.
 * @param {unknown} errorOrException The object originally caught.
 */
declare const ThrowCaughtUnknown: (messagePrefix: string, errorOrException: unknown) => void;
/**
 * Takes arguments in a variety of types, converts them to strings, and checks
 * whether those string representations will break CSV formatting. Specifically,
 * it throws in the event it finds a comma or newline. Otherwise it returns
 * silently.
 * @param {(string | number | boolean)} x
 */
declare const ValidateTextForCSV: (x: string | number | boolean) => void;
/**
 * Creates a string that represents a duration in milliseconds, and variations
 * of the same in seconds, minutes and hours.
 * @param {number} durationMS The time in milliseconds
 * @return {string} Example: "15000 ms / 15.00 sec / 0.25 min / 0.0 hr"
 */
declare const WriteDurationReport: (durationMS: number) => string;
export { ArrayCalculateAverage, ArrayFindIndexOfHighestValue, Assert, CheckNonNegativeInteger, CheckFloat0to1Exclusive, CheckPositiveInteger, QueueRotate, ThrowCaughtUnknown, ValidateTextForCSV, WriteDurationReport };
