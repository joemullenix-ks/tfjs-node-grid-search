import { EpochStats } from './EpochStats';
import { ModelParams } from './ModelParams';
import { ModelTestStats } from './ModelTestStats';
/**
 * Gathers all of the information we have for a single model run (aka
 * "iteration" or "grid cell").
 */
declare class IterationResult {
    private _iteration;
    private _descriptor;
    private _epochStats;
    private _modelParams;
    private _modelTestStats;
    private _repetition;
    private _runDuration;
    private _score;
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
    constructor(_iteration: number, _descriptor: string, _epochStats: EpochStats, _modelParams: ModelParams, _modelTestStats: ModelTestStats, _repetition: number, _runDuration: number);
    get iteration(): number;
    get repetition(): number;
    get runDuration(): number;
    get score(): number;
    /**
     * Gets the header for the {@link EpochStats} section of the CSV table.
     * @return {string}
     */
    WriteEpochStatsHeader(): string;
    /**
     * Gets the body for the {@link EpochStats} section of the CSV table.
     * @return {string}
     */
    WriteEpochStatsValues(): string;
    /**
     * Gets the header for the {@link ModelParams} section of the CSV table.
     * @return {string}
     */
    WriteModelParamHeader(): string;
    /**
     * Gets the body for the {@link ModelParams} section of the CSV table.
     * @return {string}
     */
    WriteModelParamValues(): string;
    /**
     * Gets the header for the {@link ModelTestStats} section of the CSV table.
     * @return {string}
     */
    WriteTestStatsHeader(): string;
    /**
     * Gets the body for the {@link ModelTestStats} section of the CSV table.
     * @return {string}
     */
    WriteTestStatsValues(): string;
    /**
     * Gets the console logging report for this model run.
     * @return {string}
     */
    WriteReport(): string;
}
export { IterationResult };
