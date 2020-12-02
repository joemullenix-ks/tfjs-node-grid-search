'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPORT_HEADER = exports.EpochStats = void 0;
const simple_statistics_1 = require("simple-statistics");
const Utils_1 = require("./Utils");
class EpochStats {
    constructor(_trailDepth) {
        this._trailDepth = _trailDepth;
        this._samplesAccuracy = [];
        this._samplesLoss = [];
        this._samplesValidationAccuracy = [];
        this._samplesValidationLoss = [];
        this._averageAccuracy = 0;
        this._averageLoss = 0;
        this._averageLossDelta = 0;
        this._averageValidationAccuracy = 0;
        this._averageValidationLoss = 0;
        this._lineAccuracy = { m: 0, b: 0 };
        this._lineLoss = { m: 0, b: 0 };
        this._lineValidationAccuracy = { m: 0, b: 0 };
        this._lineValidationLoss = { m: 0, b: 0 };
        console.assert(this._trailDepth > 0);
        console.assert(Math.floor(this._trailDepth) === this._trailDepth);
    }
    get averageAccuracy() { return this._averageAccuracy; }
    get averageLoss() { return this._averageLoss; }
    get averageValidationAccuracy() { return this._averageValidationAccuracy; }
    get averageValidationLoss() { return this._averageValidationLoss; }
    get lineAccuracy() { return this._lineAccuracy; }
    get lineLoss() { return this._lineLoss; }
    get lineValidationAccuracy() { return this._lineValidationAccuracy; }
    get lineValidationLoss() { return this._lineValidationLoss; }
    Update(epoch, logs) {
        console.assert(epoch >= 0);
        console.assert(Math.floor(epoch) === epoch);
        console.assert(typeof logs === 'object');
        Utils_1.Utils.QueueRotate(this._samplesAccuracy, logs.acc, this._trailDepth);
        Utils_1.Utils.QueueRotate(this._samplesLoss, logs.loss, this._trailDepth);
        Utils_1.Utils.QueueRotate(this._samplesValidationAccuracy, logs.val_acc, this._trailDepth);
        Utils_1.Utils.QueueRotate(this._samplesValidationLoss, logs.val_loss, this._trailDepth);
        this._averageAccuracy = Utils_1.Utils.ArrayCalculateAverage(this._samplesAccuracy);
        this._averageLoss = Utils_1.Utils.ArrayCalculateAverage(this._samplesLoss);
        this._averageValidationAccuracy = Utils_1.Utils.ArrayCalculateAverage(this._samplesValidationAccuracy);
        this._averageValidationLoss = Utils_1.Utils.ArrayCalculateAverage(this._samplesValidationLoss);
        const TRAILING_ACC_AS_XY = this._samplesAccuracy.map((value, index) => { return [index, value]; });
        const TRAILING_LOSS_AS_XY = this._samplesLoss.map((value, index) => { return [index, value]; });
        const TRAILING_VAL_ACC_AS_XY = this._samplesValidationAccuracy.map((value, index) => { return [index, value]; });
        const TRAILING_VAL_LOSS_AS_XY = this._samplesValidationLoss.map((value, index) => { return [index, value]; });
        this._lineAccuracy = simple_statistics_1.linearRegression(TRAILING_ACC_AS_XY);
        this._lineLoss = simple_statistics_1.linearRegression(TRAILING_LOSS_AS_XY);
        this._lineValidationAccuracy = simple_statistics_1.linearRegression(TRAILING_VAL_ACC_AS_XY);
        this._lineValidationLoss = simple_statistics_1.linearRegression(TRAILING_VAL_LOSS_AS_XY);
        this._averageLossDelta = this._averageLoss - this._averageValidationLoss;
    }
    //vv TODO: These move into a CSVSource interface
    WriteCSVLineKeys() {
        return 'averageAccuracy,averageLoss,averageValidationAccuracy,averageValidationLoss,slopeAccuracy,slopeLoss,slopeValidationAccuracy,slopeValidationLoss';
    }
    WriteCSVLineValues() {
        return this._averageAccuracy
            + ',' + this._averageLoss
            + ',' + this._averageValidationAccuracy
            + ',' + this._averageValidationLoss
            + ',' + this._lineAccuracy.m
            + ',' + this._lineLoss.m
            + ',' + this._lineValidationAccuracy.m
            + ',' + this._lineValidationLoss.m;
    }
    //^^
    WriteReport() {
        const TEXT_OUT = this._averageLoss.toFixed(REPORTING_DIGITS_STAT)
            + '(' + this._averageValidationLoss.toFixed(REPORTING_DIGITS_STAT) + ') '
            + 'Δ ' + (this._averageLossDelta < 0 ? '' : ' ') + this._averageLossDelta.toFixed(2) + ', '
            + 'm ' + (this._lineLoss.m < 0 ? '' : ' ') + this._lineLoss.m.toFixed(REPORTING_DIGITS_SLOPE)
            + '(' + (this._lineValidationLoss.m < 0 ? '' : ' ') + this._lineValidationLoss.m.toFixed(REPORTING_DIGITS_SLOPE) + ') '
            + '\\/ '
            + this._averageAccuracy.toFixed(REPORTING_DIGITS_STAT)
            + '(' + this._averageValidationAccuracy.toFixed(REPORTING_DIGITS_STAT) + '), '
            + 'm ' + (this._lineAccuracy.m < 0 ? '' : ' ') + this._lineAccuracy.m.toFixed(REPORTING_DIGITS_SLOPE)
            + '(' + (this._lineValidationAccuracy.m < 0 ? '' : ' ') + this._lineValidationAccuracy.m.toFixed(REPORTING_DIGITS_SLOPE) + ')';
        return TEXT_OUT;
    }
}
exports.EpochStats = EpochStats;
//NOTE: This must be kept in sync with the text written by WriteReport().
const REPORT_HEADER = 'EPOCH '
    + 'LOSS(VALIDATION) '
    + 'Δ L-V DELTA, '
    + 'm LOSS-SLOPE(VALIDATION)'
    + ' \\/ '
    + 'ACCURACY(VALIDATION) '
    + 'm ACCURACY-SLOPE(VALIDATION)';
exports.REPORT_HEADER = REPORT_HEADER;
const REPORTING_DIGITS_SLOPE = 6;
const REPORTING_DIGITS_STAT = 4;
Object.freeze(EpochStats);
//# sourceMappingURL=EpochStats.js.map