'use strict';
class ModelTestStats {
    constructor(_deltaCorrect, _deltaIncorrect, _totalCorrect, _totalCases) {
        this._deltaCorrect = _deltaCorrect;
        this._deltaIncorrect = _deltaIncorrect;
        this._totalCorrect = _totalCorrect;
        this._totalCases = _totalCases;
        console.assert(Math.floor(this._totalCorrect) === this._totalCorrect);
        console.assert(this._totalCases >= this._totalCorrect);
        console.assert(Math.floor(this._totalCases) === this._totalCases);
    }
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
Object.freeze(ModelTestStats);
export { ModelTestStats };
//# sourceMappingURL=ModelTestStats.js.map