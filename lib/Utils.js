'use strict';


//TODO: Merge this into the F lib (simple array utils), once that's integrated.


const UTILS = {
	ArrayCalculateAverage: (array) => {
		console.assert(Array.isArray(array));

//PERF: This can be done more efficiently w/ a little math. Don't walk the whole set. Instead, discount a running average (which
//		we'll keep separately and pass in), by (droppedSample / total), then add (newSample / total)

		const SUM = array.reduce((previous, current) => {return previous + current}, 0);

		return SUM / array.length;
	},

	ArrayFindIndexOfHighestValue: (values) => {
		console.assert(Array.isArray(values));
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

	QueueRotate: (queue, newSample, count) => {
		console.assert(Array.isArray(queue));
		console.assert(typeof count === 'number');
		console.assert(count > 0);

		queue.push(newSample);

		if (queue.length <= count) {
			return;
		}

		queue.shift();
	},

	WriteDurationReport: (durationMS) => {
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