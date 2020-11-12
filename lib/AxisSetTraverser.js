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

//KEEP: This is useful, but currently too spammy (without digging out the axis name, it's also too vague).
//		There's a decent chance this comes back after the first round of user feedback.
//				console.log('Axis ' + i + ' reset');

				++resetCounter;

				continue;
			}

			return;
		}

		console.assert(resetCounter === this._totalAxes);

		this._traversed = true;
	}

	CreateIterationParams() {
		return this._axisSet.CreateParams();
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
