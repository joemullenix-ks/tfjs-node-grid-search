'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.IterationResult = void 0;
const ModelTestStats_1 = require("./ModelTestStats");
/**
 * Gathers all of the information we have for a single model run (aka
 * "iteration" or "grid cell").
 */
class IterationResult {
    /**
     * Creates an instance of IterationResult.
     * @param {number} _iteration The grid's current iteration counter.
     * @param {string} _descriptor A small, one-line bit of text with the
     *	dynamic axes (and their bounds) that define this iteration.
     * @param {EpochStats} _epochStats Stats from the iteration's training
     *	epochs.
     * @param {ModelParams} _modelParams The config used to create the
     *	iteration's model.
     * @param {ModelTestStats} _modelTestStats The right/wrong totals and
     *	accuracy/quality deltas from the iteration's testing phase.
     * @param {number} _repetition This grid's current repeat count for this
     *	iteration.
     * @param {number} _runDuration Execution time in milliseconds.
     */
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
        console.assert(this._modelTestStats instanceof ModelTestStats_1.ModelTestStats);
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
    /**
     * Gets the header for the {@link EpochStats} section of the CSV table.
     * @return {string}
     */
    WriteEpochStatsHeader() {
        return this._epochStats.WriteCSVLineKeys();
    }
    /**
     * Gets the body for the {@link EpochStats} section of the CSV table.
     * @return {string}
     */
    WriteEpochStatsValues() {
        return this._epochStats.WriteCSVLineValues();
    }
    /**
     * Gets the header for the {@link ModelParams} section of the CSV table.
     * @return {string}
     */
    WriteModelParamHeader() {
        return this._modelParams.WriteCSVLineKeys();
    }
    /**
     * Gets the body for the {@link ModelParams} section of the CSV table.
     * @return {string}
     */
    WriteModelParamValues() {
        return this._modelParams.WriteCSVLineValues();
    }
    /**
     * Gets the header for the {@link ModelTestStats} section of the CSV table.
     * @return {string}
     */
    WriteTestStatsHeader() {
        return this._modelTestStats.WriteCSVLineKeys();
    }
    /**
     * Gets the body for the {@link ModelTestStats} section of the CSV table.
     * @return {string}
     */
    WriteTestStatsValues() {
        return this._modelTestStats.WriteCSVLineValues();
    }
    /**
     * Gets the console logging report for this model run.
     * @return {string}
     */
    WriteReport() {
        return 'Iteration: ' + this._iteration + ', '
            + 'Repetition: ' + this._repetition + ', '
            + 'Score: ' + (100 * this._score).toFixed(1) + '%, '
            + 'Dynamics: ' + this._descriptor;
    }
}
exports.IterationResult = IterationResult;
Object.freeze(IterationResult);
//# sourceMappingURL=IterationResult.js.map