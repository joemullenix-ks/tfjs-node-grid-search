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

		this._modelStatics = modelStatics;
		this._sessionData = sessionData;

		this._axisSetTraverser = new AxisSetTraverser(axisSet);
	}

//KEEP: coming soon, probably (may happen at a higher scope)
	// LoadData() {
	//
	// }

	Run() {
// ! likely this is async; wait for each model pass; even offer up cancel-now? save-now? report-now?

		for (let iterations = 0; !this._axisSetTraverser.GetTraversed(); ++iterations) {
			console.log('Iteration ' + iterations + '\n' + this._axisSetTraverser.WriteReport());

console.log('<< MODEL RUNS HERE >>');

			this._axisSetTraverser.Advance();
		}

console.log('DONE');

	}
}


Object.freeze(Grid);

exports.Grid = Grid;
