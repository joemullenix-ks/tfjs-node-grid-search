'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridRunStats = void 0;
/**
 * Manages the statistics for all trained and tested models. Writew the final
 * report to the log and/or CSV.
 */
class GridRunStats {
    /**
     * Creates an instance of GridRunStats.
     */
    constructor() {
        this._iterationResults = [];
        // Lint gripes about empty constructors. Apperently this is good enough. Party on.
    }
    /**
     * Stores all information about a single model, both config and results.
     * @param {IterationResult} iterationResult The info package.
     */
    AddIterationResult(iterationResult) {
        this._iterationResults.push(iterationResult);
    }
    /**
     * Creates a table of text in Comma Separated Value format, ideal for
     * import via spreadsheet software.
     * @return {string}
     */
    WriteCSV() {
        if (this._iterationResults.length === 0) {
            return GridRunStats._noData;
        }
        // write the header of the CSV table
        const HEADER_TEXT = 'pass,iteration,repetition,score,duration,'
            + this._iterationResults[0].WriteModelParamHeader()
            + ','
            + this._iterationResults[0].WriteEpochStatsHeader()
            + ','
            + this._iterationResults[0].WriteTestStatsHeader();
        // write the body of the CSV table
        let iterationsTableText = '';
        this._iterationResults.forEach((value, index) => {
            iterationsTableText += index + ',' + value.iteration + ','
                + value.repetition + ',' + value.score + ','
                + value.runDuration + ',';
            // first the model params...
            iterationsTableText += value.WriteModelParamValues();
            iterationsTableText += ',';
            // ...then the epoch (loss and accuracy) stats
            iterationsTableText += value.WriteEpochStatsValues();
            iterationsTableText += ',';
            // ...then the generalization test stats
            iterationsTableText += value.WriteTestStatsValues();
            iterationsTableText += '\n';
        });
        // drop the trailing newline
        iterationsTableText = iterationsTableText.slice(0, -1);
        return HEADER_TEXT + '\n' + iterationsTableText;
    }
    /**
     * Creates a block of text intended for the console. The performance and
     * config of each model is listed, optionally sorted by score.
     * @param {boolean} sortByScore List models with the highest scores first.
     * @return {string}
     */
    WriteReport(sortByScore) {
        let iterations = this._iterationResults;
        if (sortByScore) {
            // create a shallow clone...
            iterations = this._iterationResults.slice();
            // ...then sort it by score, descending (i.e. best score first)
            iterations.sort((a, b) => { return b.score - a.score; });
        }
        let outgoingText = '';
        iterations.forEach((value) => {
            outgoingText += value.WriteReport() + '\n';
        });
        // drop the trailing newline
        outgoingText = outgoingText.slice(0, -1);
        return outgoingText;
    }
}
exports.GridRunStats = GridRunStats;
GridRunStats._noData = 'no data';
Object.freeze(GridRunStats);
//# sourceMappingURL=GridRunStats.js.map