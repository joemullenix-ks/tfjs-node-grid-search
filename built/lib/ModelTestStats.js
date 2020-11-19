'use strict';
var ModelTestStats = /** @class */ (function () {
    function ModelTestStats(deltaCorrect, deltaIncorrect, totalCorrect, totalCases) {
        console.assert(typeof deltaCorrect === 'number');
        console.assert(typeof deltaIncorrect === 'number');
        console.assert(typeof totalCorrect === 'number');
        console.assert(Math.floor(totalCorrect) === totalCorrect);
        console.assert(typeof totalCases === 'number');
        console.assert(totalCases >= totalCorrect);
        console.assert(Math.floor(totalCases) === totalCases);
        this._deltaCorrect = deltaCorrect;
        this._deltaIncorrect = deltaIncorrect;
        this._totalCorrect = totalCorrect;
        this._totalCases = totalCases;
    }
    ModelTestStats.prototype.CalculateScore = function () {
        return this._totalCorrect / this._totalCases;
    };
    //vv TODO: These move into a CSVSource interface
    ModelTestStats.prototype.WriteCSVLineKeys = function () {
        return 'deltaCorrect,deltaIncorrect,totalCorrect,totalCases';
    };
    ModelTestStats.prototype.WriteCSVLineValues = function () {
        return this._deltaCorrect
            + ',' + this._deltaIncorrect
            + ',' + this._totalCorrect
            + ',' + this._totalCases;
    };
    return ModelTestStats;
}());
Object.freeze(ModelTestStats);
exports.ModelTestStats = ModelTestStats;
//# sourceMappingURL=ModelTestStats.js.map