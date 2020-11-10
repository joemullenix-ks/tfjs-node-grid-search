'use strict';


//TODO: Merge this into the F lib (simple array utils), once that's integrated.


const UTILS = {
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

	WriteDurationReport: (durationMS) => {
		console.assert(typeof durationMS === 'number');
		console.assert(durationMS >= 0);
		console.assert(durationMS === Math.floor(durationMS)); //NOTE: A bit aggressive, I suppose; drop as needed.

//TODO: (low-pri) Bring in time-reporting from the f lib, which has smart duration-category picking.
		return (durationMS / 60 / 1000).toFixed(2) + ' mins'
				+ ' | '
				+ (durationMS / 60 / 60 / 1000).toFixed(1) + ' hrs';
	}
};


Object.freeze(UTILS);

exports.Utils = UTILS;