'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelTestStats = void 0;
const Utils = __importStar(require("./Utils"));
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
        Utils.Assert(Math.floor(this._totalCorrect) === this._totalCorrect);
        Utils.Assert(this._totalCases >= this._totalCorrect);
        Utils.Assert(Math.floor(this._totalCases) === this._totalCases);
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