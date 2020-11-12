'use strict';


const SIMPLE_STATISTICS = require('simple-statistics');


const { Utils } = require('./Utils');


class EpochStats {
	constructor(trailDepth) {
		console.assert(typeof trailDepth === 'number');
		console.assert(trailDepth > 0);
		console.assert(Math.floor(trailDepth) === trailDepth);

		this._trailDepth = trailDepth;

		this._samplesAccuracy = [];
		this._samplesLoss = [];
		this._samplesValidationAccuracy = [];
		this._samplesValidationLoss = [];
	}

	Update(epoch, logs) {
		console.assert(typeof epoch === 'number');
		console.assert(epoch >= 0);
		console.assert(Math.floor(epoch) === epoch);
		console.assert(typeof logs === 'object');

		Utils.QueueRotate(this._samplesAccuracy, logs.acc, this._trailDepth);
		Utils.QueueRotate(this._samplesLoss, logs.loss, this._trailDepth);
		Utils.QueueRotate(this._samplesValidationAccuracy, logs.val_acc, this._trailDepth);
		Utils.QueueRotate(this._samplesValidationLoss, logs.val_loss, this._trailDepth);

		this._averageAccuracy			= Utils.ArrayCalculateAverage(this._samplesAccuracy);
		this._averageLoss				= Utils.ArrayCalculateAverage(this._samplesLoss);
		this._averageValidationAccuracy	= Utils.ArrayCalculateAverage(this._samplesValidationAccuracy);
		this._averageValidationLoss		= Utils.ArrayCalculateAverage(this._samplesValidationLoss);

		const TRAILING_ACC_AS_XY		= this._samplesAccuracy.map((value, index) => {return [index, value];});
		const TRAILING_LOSS_AS_XY		= this._samplesLoss.map((value, index) => {return [index, value];});
		const TRAILING_VAL_ACC_AS_XY	= this._samplesValidationAccuracy.map((value, index) => {return [index, value];});
		const TRAILING_VAL_LOSS_AS_XY	= this._samplesValidationLoss.map((value, index) => {return [index, value];});

		this._lineAccuracy				= SIMPLE_STATISTICS.linearRegression(TRAILING_ACC_AS_XY);
		this._lineLoss					= SIMPLE_STATISTICS.linearRegression(TRAILING_LOSS_AS_XY);
		this._lineValidationAccuracy	= SIMPLE_STATISTICS.linearRegression(TRAILING_VAL_ACC_AS_XY);
		this._lineValidationLoss		= SIMPLE_STATISTICS.linearRegression(TRAILING_VAL_LOSS_AS_XY);

		this._averageLossDelta = this._averageLoss - this._averageValidationLoss;
	}

	WriteReport() {
		const TEXT_OUT =
			this._averageLoss.toFixed(REPORTING_DIGITS_STAT)
			+ '(' + this._averageValidationLoss.toFixed(REPORTING_DIGITS_STAT) + ') '
			+ 'Δ ' + (this._averageLossDelta < 0 ? '' : ' ' ) + this._averageLossDelta.toFixed(2) + ', '
			+ 'm: ' + (this._lineLoss.m < 0 ? '' : ' ' ) + this._lineLoss.m.toFixed(REPORTING_DIGITS_SLOPE)
			+ '(' + (this._lineValidationLoss.m < 0 ? '' : ' ' ) + this._lineValidationLoss.m.toFixed(REPORTING_DIGITS_SLOPE) + ') '
			+ '|| '
			+ this._averageAccuracy.toFixed(REPORTING_DIGITS_STAT)
			+ '(' + this._averageValidationAccuracy.toFixed(REPORTING_DIGITS_STAT) + '), '
			+ 'm: ' + (this._lineAccuracy.m < 0 ? '' : ' ' ) + this._lineAccuracy.m.toFixed(REPORTING_DIGITS_SLOPE)
			+ '(' + (this._lineValidationAccuracy.m < 0 ? '' : ' ' ) + this._lineValidationAccuracy.m.toFixed(REPORTING_DIGITS_SLOPE) + ')';

		return TEXT_OUT;
	}
}


//NOTE: This must be kept in sync with the text written by WriteReport().
EpochStats.ReportGuide =  'EPOCH '
						+ 'LOSS(VALIDATION) '
						+ 'L-V DELTA, '
						+ 'LOSS SLOPE(VALIDATION)'
						+ ' || '
						+ 'ACCURACY(VALIDATION) '
						+ 'ACCURACY SLOPE(VALIDATION)';


const REPORTING_DIGITS_SLOPE = 6;
const REPORTING_DIGITS_STAT = 4;


Object.freeze(EpochStats);

exports.EpochStats = EpochStats;
