import { IterationResult } from './IterationResult';
/**
 * Manages the statistics for all trained and tested models. Writew the final
 * report to the log and/or CSV.
 */
declare class GridRunStats {
    private _iterationResults;
    /**
     * Creates an instance of GridRunStats.
     */
    constructor();
    /**
     * Stores all information about a single model, both config and results.
     * @param {IterationResult} iterationResult The info package.
     */
    AddIterationResult(iterationResult: IterationResult): void;
    /**
     * Creates a table of text in Comma Separated Value format, ideal for
     * import via spreadsheet software.
     * @return {string}
     */
    WriteCSV(): string;
    /**
     * Creates a block of text intended for the console. The performance and
     * config of each model is listed, optionally sorted by score.
     * @param {boolean} sortByScore List models with the highest scores first.
     * @return {string}
     */
    WriteReport(sortByScore: boolean): string;
}
export { GridRunStats };
