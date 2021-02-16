'use strict';


import { EpochStats } from './EpochStats';
import { ModelParams } from './ModelParams';
import { ModelTestStats } from './ModelTestStats';
import * as Utils from './Utils';

/**
 * Gathers all of the information we have for a single model run (aka
 * "iteration" or "grid cell").
 */
class IterationResult {
    private _score = 0;

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
    constructor(private _iteration: number,
                private _descriptor: string,
                private _epochStats: EpochStats,
                private _modelParams: ModelParams,
                private _modelTestStats: ModelTestStats,
                private _repetition: number,
                private _runDuration: number) {
        Utils.Assert(this._iteration >= 0);
        Utils.Assert(Math.floor(this._iteration) === this._iteration);
        Utils.Assert(this._descriptor !== '');
        Utils.Assert(this._repetition >= 0);
        Utils.Assert(this._repetition === Math.floor(this._repetition));
        Utils.Assert(this._runDuration >= 0);
        Utils.Assert(this._runDuration === Math.floor(this._runDuration));

        this._score = this._modelTestStats.CalculateScore();
    }

    get iteration(): number { return this._iteration; }
    get repetition(): number { return this._repetition; }
    get runDuration(): number { return this._runDuration; }
    get score(): number { return this._score; }

//TODO: These WriteHeader/Values methods have duplicate structure and usage.
//      Enforce them with a CSVSource interface.
//      ...or maybe abstract into a base type.

    /**
     * Gets the header for the {@link EpochStats} section of the CSV table.
     * @return {string}
     */
    WriteEpochStatsHeader(): string {
        return this._epochStats.WriteCSVLineKeys();
    }

    /**
     * Gets the body for the {@link EpochStats} section of the CSV table.
     * @return {string}
     */
    WriteEpochStatsValues(): string {
        return this._epochStats.WriteCSVLineValues();
    }

    /**
     * Gets the header for the {@link ModelParams} section of the CSV table.
     * @return {string}
     */
    WriteModelParamHeader(): string {
        return this._modelParams.WriteCSVLineKeys();
    }

    /**
     * Gets the body for the {@link ModelParams} section of the CSV table.
     * @return {string}
     */
    WriteModelParamValues(): string {
        return this._modelParams.WriteCSVLineValues();
    }

    /**
     * Gets the header for the {@link ModelTestStats} section of the CSV table.
     * @return {string}
     */
    WriteTestStatsHeader(): string {
        return this._modelTestStats.WriteCSVLineKeys();
    }

    /**
     * Gets the body for the {@link ModelTestStats} section of the CSV table.
     * @return {string}
     */
    WriteTestStatsValues(): string {
        return this._modelTestStats.WriteCSVLineValues();
    }

    /**
     * Gets the console logging report for this model run.
     * @return {string}
     */
    WriteReport(): string {
        return 'Iteration: ' + this._iteration + ', '
                + 'Repetition: ' + this._repetition + ', '
                + 'Score: ' + (100 * this._score).toFixed(1) + '%, '
                + 'Dynamics: ' + this._descriptor;
    }
}


Object.freeze(IterationResult);

export { IterationResult };
