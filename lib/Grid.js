'use strict';


const { AxisSet } = require('./AxisSet');
const { AxisSetTraverser } = require('./AxisSetTraverser');
const { ModelStatics } = require('./ModelStatics');
const { SessionData } = require('./SessionData');


class Grid {
	constructor(axisSet, modelStatics, sessionData) {
		console.assert(axisSet instanceof AxisSet);
		console.assert(modelStatics instanceof ModelStatics);
		console.assert(sessionData instanceof SessionData);

		this._axisSet = axisSet;
		this._modelStatics = modelStatics;
		this._sessionData = sessionData;

		this._axisSetTraverser = new AxisSetTraverser(this._axisSet);
	}

//KEEP: for a bit
	// LoadData() {
	//
	// }

	Run() {
// ! likely this is async; wait for each model pass; even offer up cancel-now? save-now? report-now?

		while (!this._axisSetTraverser.CheckComplete()) {

//TODO: Add an iteration report writer; simple logger which will be the stub for our proper, full report
console.log('WORKING: CREATE AND RUN INTERATION', this._axisSet._axes[0].CalculatePosition());//_progression._value);

			this._axisSetTraverser.Advance();
		}

console.log('WORKING: DONE');

	}
}


Object.freeze(Grid);

exports.Grid = Grid;
