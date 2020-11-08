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
	}
};


Object.freeze(UTILS);

exports.Utils = UTILS;