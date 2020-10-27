'use strict';


const { Axis } = require('./Axis');


class AxisSet {
	constructor(axes) {
		console.assert(Array.isArray(axes));

		// validate the incoming axes
		axes.forEach(x => console.assert(x instanceof Axis));

		this._axes = axes;
	}

	Walk(callback) {
		this._axes.forEach(callback);
	}
}


Object.freeze(AxisSet);

exports.AxisSet = AxisSet;
