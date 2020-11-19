'use strict';
var EpochStats = require('./EpochStats').EpochStats;
var ModelParams = require('./ModelParams').ModelParams;
var ModelTestStats = require('./ModelTestStats').ModelTestStats;
var IterationResult = /** @class */ (function () {
    function IterationResult(iteration, descriptor, epochStats, modelParams, modelTestStats, repetition, runDuration) {
        console.assert(typeof iteration === 'number');
        console.assert(iteration >= 0);
        console.assert(typeof descriptor === 'string');
        console.assert(descriptor !== '');
        console.assert(epochStats instanceof EpochStats);
        console.assert(Math.floor(iteration) === iteration);
        console.assert(modelParams instanceof ModelParams);
        console.assert(modelTestStats instanceof ModelTestStats);
        console.assert(typeof repetition === 'number');
        console.assert(repetition >= 0);
        console.assert(repetition === Math.floor(repetition));
        console.assert(typeof runDuration === 'number');
        console.assert(runDuration >= 0);
        console.assert(runDuration === Math.floor(runDuration));
        this._iteration = iteration;
        this._descriptor = descriptor;
        this._epochStats = epochStats;
        this._modelParams = modelParams;
        this._modelTestStats = modelTestStats;
        this._repetition = repetition;
        this._runDuration = runDuration;
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
Object.freeze(IterationResult);
exports.IterationResult = IterationResult;
//# sourceMappingURL=IterationResult.js.map