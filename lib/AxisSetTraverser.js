'use strict';


const { AxisSet } = require('./AxisSet');


class AxisSetTraverser {
	constructor(axisSet) {
		console.assert(axisSet instanceof AxisSet);

		this._axisSet = axisSet;

		this._totalAxes = this._axisSet.GetTotalAxes(); // cache this; it doesn't change
	}

	Advance() {
		console.assert(!this.CheckComplete());

		for (let i = 0; i < this._totalAxes; ++i) {
			if (this._axisSet.CheckAxisComplete(i)) {
				this._axisSet.ResetAxis(i);

//NOTE: TODO: Decent chance this becomes too spammy; considering a logger w/ verbocity options.
				console.log('axis ' + i + ' reset');

				continue;
			}

			this._axisSet.AdvanceAxis(i);

			return;
		}

		throw new Error('failed to advance (if all axes are complete, the traversal cannot advance)');
	}

	CheckComplete() {
		for (let i = 0; i < this._totalAxes; ++i) {
			if (this._axisSet.CheckAxisComplete(i)) {
				continue;
			}

			return false;
		}

		return true;
	}
}


Object.freeze(AxisSetTraverser);

exports.AxisSetTraverser = AxisSetTraverser;
