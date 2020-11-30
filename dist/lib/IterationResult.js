'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.IterationResult = void 0;
var ModelTestStats_1 = require("./ModelTestStats");
var IterationResult = /** @class */ (function () {
    function IterationResult(_iteration, _descriptor, _epochStats, _modelParams, _modelTestStats, _repetition, _runDuration) {
        this._iteration = _iteration;
        this._descriptor = _descriptor;
        this._epochStats = _epochStats;
        this._modelParams = _modelParams;
        this._modelTestStats = _modelTestStats;
        this._repetition = _repetition;
        this._runDuration = _runDuration;
        this._score = 0;
        console.assert(this._iteration >= 0);
        console.assert(Math.floor(this._iteration) === this._iteration);
        console.assert(this._descriptor !== '');
        console.assert(this._modelTestStats instanceof ModelTestStats_1.ModelTestStats);
        console.assert(this._repetition >= 0);
        console.assert(this._repetition === Math.floor(this._repetition));
        console.assert(this._runDuration >= 0);
        console.assert(this._runDuration === Math.floor(this._runDuration));
        this._score = this._modelTestStats.CalculateScore();
    }
    Object.defineProperty(IterationResult.prototype, "iteration", {
        get: function () { return this._iteration; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IterationResult.prototype, "repetition", {
        get: function () { return this._repetition; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IterationResult.prototype, "runDuration", {
        get: function () { return this._runDuration; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IterationResult.prototype, "score", {
        get: function () { return this._score; },
        enumerable: false,
        configurable: true
    });
    //TODO: These WriteHeader/Values methods have duplicate structure and usage.
    //		Enforce them with a CSVSource interface.
    //		...or maybe abstract into a base type.
    IterationResult.prototype.WriteEpochStatsHeader = function () {
        return this._epochStats.WriteCSVLineKeys();
    };
    IterationResult.prototype.WriteEpochStatsValues = function () {
        return this._epochStats.WriteCSVLineValues();
    };
    IterationResult.prototype.WriteModelParamHeader = function () {
        return this._modelParams.WriteCSVLineKeys();
    };
    IterationResult.prototype.WriteModelParamValues = function () {
        return this._modelParams.WriteCSVLineValues();
    };
    IterationResult.prototype.WriteTestStatsHeader = function () {
        return this._modelTestStats.WriteCSVLineKeys();
    };
    IterationResult.prototype.WriteTestStatsValues = function () {
        return this._modelTestStats.WriteCSVLineValues();
    };
    IterationResult.prototype.WriteReport = function () {
        return 'Iteration: ' + this._iteration + ', '
            + 'Repetition: ' + this._repetition + ', '
            + 'Score: ' + (100 * this._score).toFixed(1) + '%, '
            + 'Dynamics: ' + this._descriptor;
    };
    return IterationResult;
}());
exports.IterationResult = IterationResult;
Object.freeze(IterationResult);
//# sourceMappingURL=IterationResult.js.map