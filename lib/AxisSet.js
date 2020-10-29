'use strict';


const { Axis } = require('./Axis');


class AxisSet {
	constructor(axes) {
		console.assert(Array.isArray(axes));

		// validate the incoming axes

		const AXES_BY_TYPE = {};

		axes.forEach((x) => {
			console.assert(x instanceof Axis)

			// no duplicates
			if (AXES_BY_TYPE[x.GetType()] !== undefined) {
				throw new Error('Duplicate axis found: ' + Axis.LookupTypeName(x.GetType()));
			}

			AXES_BY_TYPE[x.GetType()] = 0;
		});

		this._axes = axes;
	}

	AdvanceAxis(index) {
		this.ValidateIndex(index);

		this._axes[index].Advance();
	}

	CheckAxisComplete(index) {
		this.ValidateIndex(index);

		return this._axes[index].CheckComplete();
	}

	CreateParams() {
		const PARAMS = {};

		for (let i = 0; i < this._axes.length; ++i) {
			const AXIS = this._axes[i];

//TODO: Should we do these by index or key?? This isn't particularly perf-intensive, so keys will be much friendlier to write
//		and debug.
//		This will be revisited when I implement minification.
			PARAMS[AXIS.GetTypeName()] = AXIS.CalculatePosition();
		}

		return PARAMS;
	}

	GetTotalAxes() {
		return this._axes.length;
	}

	ResetAxis(index) {
		this.ValidateIndex(index);

		return this._axes[index].Reset();
	}

	ValidateIndex(index) {
		console.assert(typeof index === 'number');
		console.assert(index >= 0);
		console.assert(index < this._axes.length);
	}

	Walk(callback) {
		console.assert(typeof callback === 'function');

		this._axes.forEach(callback);
	}

	WriteAxisReport(index) {
		this.ValidateIndex(index);

		return this._axes[index].WriteReport();
	}
}


Object.freeze(AxisSet);

exports.AxisSet = AxisSet;
