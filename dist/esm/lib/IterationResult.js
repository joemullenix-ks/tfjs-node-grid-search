'use strict';
import { ModelTestStats } from './ModelTestStats';
class IterationResult {
    constructor(_iteration, _descriptor, _epochStats, _modelParams, _modelTestStats, _repetition, _runDuration) {
        this._iteration = _iteration;
        this._descriptor = _descriptor;
        this._epochStats = _epochStats;
        this._modelParams = _modelParams;
        this._modelTestStats = _modelTestStats;
        this._repetition = _repetition;
        this._runDuration = _runDuration;
        this._score = 0;
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
export { IterationResult };
//# sourceMappingURL=IterationResult.js.map