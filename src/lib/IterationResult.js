'use strict';


const { EpochStats } = require('./EpochStats');
const { ModelParams } = require('./ModelParams');
const { ModelTestStats } = require('./ModelTestStats');


class IterationResult {
	constructor(iteration, descriptor, epochStats, modelParams, modelTestStats, repetition, runDuration) {
		console.assert(typeof iteration === 'number');
		console.assert(iteration >= 0);
		console.assert(typeof descriptor === 'string');
		console.assert(descriptor !== '');
		console.assert(epochStats instanceof EpochStats);
		console.assert(Math.floor(iteration) === iteration);
		console.assert(modelParams instanceof ModelParams);
		console.assert(modelTestStats instanceof ModelTestStats);
		console.assert(typeof repetition === 'number');
		console.assert(repetition >= 0);
		console.assert(repetition === Math.floor(repetition));
		console.assert(typeof runDuration === 'number');
		console.assert(runDuration >= 0);
		console.assert(runDuration === Math.floor(runDuration));

		this._iteration = iteration;
		this._descriptor = descriptor;
		this._epochStats = epochStats;
		this._modelParams = modelParams;
		this._modelTestStats = modelTestStats;
		this._repetition = repetition;
		this._runDuration = runDuration;

		this._score = this._modelTestStats.CalculateScore();
	}

	get iteration() { return this._iteration; }
	get repetition() { return this._repetition; }
	get runDuration() { return this._runDuration; }
	get score() { return this._score; }

//TODO: These WriteHeader/Values methods have duplicate structure and usage.
//		Enforce them with a CSVSource interface.
//		...or maybe abstract into a base type.

	WriteEpochStatsHeader() {
		return this._epochStats.WriteCSVLineKeys();
	}

	WriteEpochStatsValues() {
		return this._epochStats.WriteCSVLineValues();
	}

	WriteModelParamHeader() {
		return this._modelParams.WriteCSVLineKeys();
	}

	WriteModelParamValues() {
		return this._modelParams.WriteCSVLineValues();
	}

	WriteTestStatsHeader() {
		return this._modelTestStats.WriteCSVLineKeys();
	}

	WriteTestStatsValues() {
		return this._modelTestStats.WriteCSVLineValues();
	}

	WriteReport() {
		return 'Iteration: ' + this._iteration + ', '
				+ 'Repetition: ' + this._repetition + ', '
				+ 'Score: ' + (100 * this._score).toFixed(1) + '%, '
				+ 'Dynamics: ' + this._descriptor;
	}
}


Object.freeze(IterationResult);

exports.IterationResult = IterationResult;
