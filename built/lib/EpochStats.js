'use strict';
var SIMPLE_STATISTICS = require('simple-statistics');
var Utils = require('./Utils').Utils;
var EpochStats = /** @class */ (function () {
    function EpochStats(trailDepth) {
        console.assert(typeof trailDepth === 'number');
        console.assert(trailDepth > 0);
        console.assert(Math.floor(trailDepth) === trailDepth);
        this._trailDepth = trailDepth;
        this._samplesAccuracy = [];
        this._samplesLoss = [];
        this._samplesValidationAccuracy = [];
        this._samplesValidationLoss = [];
    }
    Object.defineProperty(EpochStats.prototype, "averageAccuracy", {
        get: function () { return this._averageAccuracy; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EpochStats.prototype, "averageLoss", {
        get: function () { return this._averageLoss; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EpochStats.prototype, "averageValidationAccuracy", {
        get: function () { return this._averageValidationAccuracy; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EpochStats.prototype, "averageValidationLoss", {
        get: function () { return this._averageValidationLoss; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EpochStats.prototype, "lineAccuracy", {
        get: function () { return this._lineAccuracy; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EpochStats.prototype, "lineLoss", {
        get: function () { return this._lineLoss; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EpochStats.prototype, "lineValidationAccuracy", {
        get: function () { return this._lineValidationAccuracy; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EpochStats.prototype, "lineValidationLoss", {
        get: function () { return this._lineValidationLoss; },
        enumerable: false,
        configurable: true
    });
    EpochStats.prototype.Update = function (epoch, logs) {
        console.assert(typeof epoch === 'number');
        console.assert(epoch >= 0);
        console.assert(Math.floor(epoch) === epoch);
        console.assert(typeof logs === 'object');
        Utils.QueueRotate(this._samplesAccuracy, logs.acc, this._trailDepth);
        Utils.QueueRotate(this._samplesLoss, logs.loss, this._trailDepth);
        Utils.QueueRotate(this._samplesValidationAccuracy, logs.val_acc, this._trailDepth);
        Utils.QueueRotate(this._samplesValidationLoss, logs.val_loss, this._trailDepth);
        this._averageAccuracy = Utils.ArrayCalculateAverage(this._samplesAccuracy);
        this._averageLoss = Utils.ArrayCalculateAverage(this._samplesLoss);
        this._averageValidationAccuracy = Utils.ArrayCalculateAverage(this._samplesValidationAccuracy);
        this._averageValidationLoss = Utils.ArrayCalculateAverage(this._samplesValidationLoss);
        var TRAILING_ACC_AS_XY = this._samplesAccuracy.map(function (value, index) { return [index, value]; });
        var TRAILING_LOSS_AS_XY = this._samplesLoss.map(function (value, index) { return [index, value]; });
        var TRAILING_VAL_ACC_AS_XY = this._samplesValidationAccuracy.map(function (value, index) { return [index, value]; });
        var TRAILING_VAL_LOSS_AS_XY = this._samplesValidationLoss.map(function (value, index) { return [index, value]; });
        this._lineAccuracy = SIMPLE_STATISTICS.linearRegression(TRAILING_ACC_AS_XY);
        this._lineLoss = SIMPLE_STATISTICS.linearRegression(TRAILING_LOSS_AS_XY);
        this._lineValidationAccuracy = SIMPLE_STATISTICS.linearRegression(TRAILING_VAL_ACC_AS_XY);
        this._lineValidationLoss = SIMPLE_STATISTICS.linearRegression(TRAILING_VAL_LOSS_AS_XY);
        this._averageLossDelta = this._averageLoss - this._averageValidationLoss;
    };
    //vv TODO: These move into a CSVSource interface
    EpochStats.prototype.WriteCSVLineKeys = function () {
        return 'averageAccuracy,averageLoss,averageValidationAccuracy,averageValidationLoss,slopeAccuracy,slopeLoss,slopeValidationAccuracy,slopeValidationLoss';
    };
    EpochStats.prototype.WriteCSVLineValues = function () {
        return this._averageAccuracy
            + ',' + this._averageLoss
            + ',' + this._averageValidationAccuracy
            + ',' + this._averageValidationLoss
            + ',' + this._lineAccuracy.m
            + ',' + this._lineLoss.m
            + ',' + this._lineValidationAccuracy.m
            + ',' + this._lineValidationLoss.m;
    };
    //^^
    EpochStats.prototype.WriteReport = function () {
        var TEXT_OUT = this._averageLoss.toFixed(REPORTING_DIGITS_STAT)
            + '(' + this._averageValidationLoss.toFixed(REPORTING_DIGITS_STAT) + ') '
            + 'Δ ' + (this._averageLossDelta < 0 ? '' : ' ') + this._averageLossDelta.toFixed(2) + ', '
            + 'm ' + (this._lineLoss.m < 0 ? '' : ' ') + this._lineLoss.m.toFixed(REPORTING_DIGITS_SLOPE)
            + '(' + (this._lineValidationLoss.m < 0 ? '' : ' ') + this._lineValidationLoss.m.toFixed(REPORTING_DIGITS_SLOPE) + ') '
            + '|| '
            + this._averageAccuracy.toFixed(REPORTING_DIGITS_STAT)
            + '(' + this._averageValidationAccuracy.toFixed(REPORTING_DIGITS_STAT) + '), '
            + 'm ' + (this._lineAccuracy.m < 0 ? '' : ' ') + this._lineAccuracy.m.toFixed(REPORTING_DIGITS_SLOPE)
            + '(' + (this._lineValidationAccuracy.m < 0 ? '' : ' ') + this._lineValidationAccuracy.m.toFixed(REPORTING_DIGITS_SLOPE) + ')';
        return TEXT_OUT;
    };
    return EpochStats;
}());
//NOTE: This must be kept in sync with the text written by WriteReport().
EpochStats.ReportGuide = 'EPOCH '
    + 'LOSS(VALIDATION) '
    + 'Δ L-V DELTA, '
    + 'm LOSS-SLOPE(VALIDATION)'
    + ' || '
    + 'ACCURACY(VALIDATION) '
    + 'm ACCURACY-SLOPE(VALIDATION)';
var REPORTING_DIGITS_SLOPE = 6;
var REPORTING_DIGITS_STAT = 4;
Object.freeze(EpochStats);
exports.EpochStats = EpochStats;
