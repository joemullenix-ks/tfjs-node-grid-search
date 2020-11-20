'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelTestStats = void 0;
var ModelTestStats = /** @class */ (function () {
    function ModelTestStats(_deltaCorrect, _deltaIncorrect, _totalCorrect, _totalCases) {
        this._deltaCorrect = _deltaCorrect;
        this._deltaIncorrect = _deltaIncorrect;
        this._totalCorrect = _totalCorrect;
        this._totalCases = _totalCases;
        console.assert(Math.floor(this._totalCorrect) === this._totalCorrect);
        console.assert(this._totalCases >= this._totalCorrect);
        console.assert(Math.floor(this._totalCases) === this._totalCases);
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
exports.ModelTestStats = ModelTestStats;
Object.freeze(ModelTestStats);
//# sourceMappingURL=ModelTestStats.js.map