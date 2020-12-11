'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelTestStats = void 0;
/**
 * Gathers the scores (right/wrong and accuracy delta) for a model run. These
 * are determined via callback, during the search iteration's testing phase.
 */
class ModelTestStats {
    /**
     * Creates an instance of ModelTestStats.
     * @param {number} _deltaCorrect Aggregate accuracy deltas for the cases
     *	with 'correct' predictions.
     * @param {number} _deltaIncorrect Aggregate accuracy deltas for the cases
     *	with 'incorrect' predictions.
     * @param {number} _totalCorrect Sum of cases with 'correct' predictions.
     * @param {number} _totalCases Sum of cases used to test (aka proof cases).
     */
    constructor(_deltaCorrect, _deltaIncorrect, _totalCorrect, _totalCases) {
        this._deltaCorrect = _deltaCorrect;
        this._deltaIncorrect = _deltaIncorrect;
        this._totalCorrect = _totalCorrect;
        this._totalCases = _totalCases;
        console.assert(Math.floor(this._totalCorrect) === this._totalCorrect);
        console.assert(this._totalCases >= this._totalCorrect);
        console.assert(Math.floor(this._totalCases) === this._totalCases);
    }
    /**
     * Gets correct / total.
     * @return {number}
     */
    CalculateScore() {
        return this._totalCorrect / this._totalCases;
    }
    //vv TODO: These move into a CSVSource interface
    WriteCSVLineKeys() {
        return 'deltaCorrect,deltaIncorrect,totalCorrect,totalCases';
    }
    WriteCSVLineValues() {
        return this._deltaCorrect
            + ',' + this._deltaIncorrect
            + ',' + this._totalCorrect
            + ',' + this._totalCases;
    }
}
exports.ModelTestStats = ModelTestStats;
Object.freeze(ModelTestStats);
//# sourceMappingURL=ModelTestStats.js.map