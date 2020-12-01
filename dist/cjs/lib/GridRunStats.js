'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridRunStats = void 0;
class GridRunStats {
    constructor() {
        this._iterationResults = [];
        // Lint gripes about empty constructors. Apperently this is good enough. Party on.
    }
    AddIterationResult(iterationResult) {
        this._iterationResults.push(iterationResult);
    }
    WriteCSV() {
        if (this._iterationResults.length === 0) {
            return 'no data';
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
            iterationsTableText += index + ',' + value.iteration + ',' + value.repetition + ',' + value.score + ',' + value.runDuration + ',';
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
Object.freeze(GridRunStats);
//# sourceMappingURL=GridRunStats.js.map