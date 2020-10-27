'use strict';


const { AxisSet } = require('./AxisSet');
const { ModelStatics } = require('./ModelStatics');


class Grid {
	constructor(axisSet, modelStatics) {
		console.assert(axisSet instanceof AxisSet);
		console.assert(modelStatics instanceof ModelStatics);

		this._axisSet = axisSet;
		this._modelStatics = modelStatics;
	}
}


Object.freeze(Grid);

exports.Grid = Grid;
