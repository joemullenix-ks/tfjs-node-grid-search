'use strict';


const { ModelTestStats } = require("./ModelTestStats");


class IterationResult {
	constructor(id, descriptor, modelParams, modelTestStats) {
		console.assert(typeof id === 'number');
		console.assert(id >= 0);
		console.assert(typeof descriptor === 'string');
		console.assert(descriptor !== '');
		console.assert(Math.floor(id) === id);
		console.assert(typeof modelParams === 'object');
		console.assert(modelTestStats instanceof ModelTestStats);

		this._id = id;
		this._descriptor = descriptor;
		this._modelParams = modelParams;
		this._modelTestStats = modelTestStats;

		this._score = this._modelTestStats.CalculateScore();
	}

	get score() { return this._score; }

	WriteReport() {
		return 'Iteration: ' + this._id + ', '
				+ 'Score: ' + (100 * this._score).toFixed(1) + '%, '
				+ 'Dynamics: ' + this._descriptor;
	}
}


Object.freeze(IterationResult);

exports.IterationResult = IterationResult;
