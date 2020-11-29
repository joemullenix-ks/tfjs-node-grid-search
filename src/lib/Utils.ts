'use strict';


//TODO: Merge these into the F lib, once that's integrated.


const UTILS = {
	ArrayCalculateAverage: (array: Array<number>): number => {
		if (array.length === 0) {
			throw new Error('Cannot calculate average. Array is empty.');
		}

//PERF: This can be done more efficiently w/ a little math. Don't walk the whole set. Instead, discount a running average (which
//		we'll keep separately and pass in), by (droppedSample / total), then add (newSample / total).

		const SUM = array.reduce((previous, current) => {return previous + current}, 0);

		return SUM / array.length;
	},

	ArrayFindIndexOfHighestValue: (values: Array<number>): number => {
		console.assert(values.length > 0);

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
	},

	CheckNonNegativeInteger: (x: number): boolean => {
		if (x < 0) {
			return false;
		}

		if (x !== Math.floor(x)) {
			return false;
		}

		return true;
	},

	CheckFloat0to1Exclusive: (x: number): boolean => {
		if (x <= 0) {
			return false;
		}

		if (x >= 1) {
			return false;
		}

		return true;
	},

	CheckPositiveInteger: (x: number): boolean => {
		if (!UTILS.CheckNonNegativeInteger(x)) {
			return false;
		}

		if (x < 1) {
			return false;
		}

		return true;
	},

	QueueRotate: (queue: Array<number>, newSample: number, count: number): void => {
		console.assert(count >= 1);

		queue.push(newSample);

		if (queue.length <= count) {
			return;
		}

		queue.shift();
	},

	ThrowCaughtUnknown: (messagePrefix: string, errorOrException: unknown): void => {
		if (typeof errorOrException === 'string') {
			throw new Error(messagePrefix + errorOrException);
		}

		if (errorOrException instanceof Error) {
			throw new Error(messagePrefix + errorOrException.message);
		}

		throw new Error(messagePrefix + 'unknown exception type');
	},

	ValidateTextForCSV: (x: string | number | boolean): void => {
//NOTE: Add whichever (just not TS any) input type. That's the point, here. We're looking at the argument
//		after it's been cast to string, to ensure we have cleanly CSV-able information for file write().

		const AS_STRING = x.toString();

		if (AS_STRING.indexOf(',') === -1 && AS_STRING.indexOf('\n') === -1) {
			return;
		}

		throw new Error('Value contains comma or newline (which interferes with CSV): ' + x + ', ' + AS_STRING);
	},

	WriteDurationReport: (durationMS: number): string => {
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


Object.freeze(UTILS);

export { UTILS as Utils };
