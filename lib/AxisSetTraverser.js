'use strict';


const { AxisSet } = require('./AxisSet');


class AxisSetTraverser {
	constructor(axisSet) {
		console.assert(axisSet instanceof AxisSet);

		this._axisSet = axisSet;

		this._totalAxes = this._axisSet.GetTotalAxes(); // cache this; it doesn't change

		this._traversed = false;
	}

	Advance() {
		console.assert(!this._traversed);

		let resetCounter = 0;

		for (let i = 0; i < this._totalAxes; ++i) {
			this._axisSet.AdvanceAxis(i);

			if (this._axisSet.CheckAxisComplete(i)) {
				this._axisSet.ResetAxis(i);

//NOTE: TODO: Decent chance this becomes too spammy; considering a logger w/ verbocity options.
				console.log('axis ' + i + ' reset');

				++resetCounter;

				continue;
			}

			return;
		}

		console.assert(resetCounter === this._totalAxes);

		this._traversed = true;

		console.log('axis-set traversal complete');
	}

	GetTraversed() {
		return this._traversed;
	}

	WriteReport() {
		let reportText = '';

		for (let i = 0; i < this._totalAxes; ++i) {
			reportText += this._axisSet.WriteAxisReport(i) + '\n';
		}

		// remove the trailing newline
		reportText = reportText.slice(0, -1);

		return reportText;
	}
}


Object.freeze(AxisSetTraverser);

exports.AxisSetTraverser = AxisSetTraverser;
