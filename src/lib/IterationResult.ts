'use strict';


import { EpochStats } from './EpochStats';
import { ModelParams } from './ModelParams';
import { ModelTestStats } from './ModelTestStats';


class IterationResult {
	private _score = 0;

	constructor(private _iteration: number,
				private _descriptor: string,
				private _epochStats: EpochStats,
				private _modelParams: ModelParams,
				private _modelTestStats: ModelTestStats,
				private _repetition: number,
				private _runDuration: number) {
		console.assert(this._iteration >= 0);
		console.assert(Math.floor(this._iteration) === this._iteration);
		console.assert(this._descriptor !== '');
		console.assert(this._modelTestStats instanceof ModelTestStats);
		console.assert(this._repetition >= 0);
		console.assert(this._repetition === Math.floor(this._repetition));
		console.assert(this._runDuration >= 0);
		console.assert(this._runDuration === Math.floor(this._runDuration));

		this._score = this._modelTestStats.CalculateScore();
	}

	get iteration(): number { return this._iteration; }
	get repetition(): number { return this._repetition; }
	get runDuration(): number { return this._runDuration; }
	get score(): number { return this._score; }

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

export { IterationResult };
