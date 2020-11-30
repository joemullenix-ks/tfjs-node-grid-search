'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridRunStats = void 0;
var GridRunStats = /** @class */ (function () {
    function GridRunStats() {
        this._iterationResults = [];
        // Lint gripes about empty constructors. Apperently this is good enough. Party on.
    }
    GridRunStats.prototype.AddIterationResult = function (iterationResult) {
        this._iterationResults.push(iterationResult);
    };
    GridRunStats.prototype.WriteCSV = function () {
        if (this._iterationResults.length === 0) {
            return 'no data';
        }
        // write the header of the CSV table
        var HEADER_TEXT = 'pass,iteration,repetition,score,duration,'
            + this._iterationResults[0].WriteModelParamHeader()
            + ','
            + this._iterationResults[0].WriteEpochStatsHeader()
            + ','
            + this._iterationResults[0].WriteTestStatsHeader();
        // write the body of the CSV table
        var iterationsTableText = '';
        this._iterationResults.forEach(function (value, index) {
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
    };
    GridRunStats.prototype.WriteReport = function (sortByScore) {
        var iterations = this._iterationResults;
        if (sortByScore) {
            // create a shallow clone...
            iterations = this._iterationResults.slice();
            // ...then sort it by score, descending (i.e. best score first)
            iterations.sort(function (a, b) { return b.score - a.score; });
        }
        var outgoingText = '';
        iterations.forEach(function (value) {
            outgoingText += value.WriteReport() + '\n';
        });
        // drop the trailing newline
        outgoingText = outgoingText.slice(0, -1);
        return outgoingText;
    };
    return GridRunStats;
}());
exports.GridRunStats = GridRunStats;
Object.freeze(GridRunStats);
//# sourceMappingURL=GridRunStats.js.map