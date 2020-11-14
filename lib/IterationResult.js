'use strict';


const { ModelParams } = require('./ModelParams');
const { ModelTestStats } = require('./ModelTestStats');


class IterationResult {
	constructor(id, descriptor, modelParams, modelTestStats, repetition) {
		console.assert(typeof id === 'number');
		console.assert(id >= 0);
		console.assert(typeof descriptor === 'string');
		console.assert(descriptor !== '');
		console.assert(Math.floor(id) === id);
		console.assert(modelParams instanceof ModelParams);
		console.assert(modelTestStats instanceof ModelTestStats);
		console.assert(typeof repetition === 'number');
		console.assert(repetition >= 0);
		console.assert(repetition === Math.floor(repetition));

		this._id = id;
		this._descriptor = descriptor;
		this._modelParams = modelParams;
		this._modelTestStats = modelTestStats;
		this._repetition = repetition;

		this._score = this._modelTestStats.CalculateScore();
	}

	get id() { return this._id; }
	get repetition() { return this._repetition; }
	get score() { return this._score; }

//TODO: These WriteHeader/Values methods have duplicate structure and usage.
//		Abstract them into a base type, or maybe an interface.

	WriteModelParamHeader() {
		return this._modelParams.WriteLineKeys();
	}

	WriteModelParamValues() {
		return this._modelParams.WriteLineValues();
	}

	WriteTestStatsHeader() {
		return this._modelTestStats.WriteLineKeys();
	}

	WriteTestStatsValues() {
		return this._modelTestStats.WriteLineValues();
	}

	WriteReport() {
		return 'Iteration: ' + this._id + ', '
				+ 'Repetition: ' + this._repetition + ', '
				+ 'Score: ' + (100 * this._score).toFixed(1) + '%, '
				+ 'Dynamics: ' + this._descriptor;
	}
}


Object.freeze(IterationResult);

exports.IterationResult = IterationResult;
