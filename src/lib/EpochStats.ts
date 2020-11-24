'use strict';


import { Logs } from '@tensorflow/tfjs-node';


import { linearRegression } from 'simple-statistics';


import { Utils } from './Utils';


//NOTE: This depends on simple-statistics(tm), which doesn't use a type for its basic line object.
type SSLine = {m: number, b: number}; // slope and intercept


class EpochStats {
	private _samplesAccuracy: Array<number> = [];
	private _samplesLoss: Array<number> = [];
	private _samplesValidationAccuracy: Array<number> = [];
	private _samplesValidationLoss: Array<number> = [];
	private _averageAccuracy: number = 0;
	private _averageLoss: number = 0;
	private _averageLossDelta: number = 0;
	private _averageValidationAccuracy: number = 0;
	private _averageValidationLoss: number = 0;

	private _lineAccuracy: SSLine = {m: 0, b: 0};
	private _lineLoss: SSLine = {m: 0, b: 0};
	private _lineValidationAccuracy: SSLine = {m: 0, b: 0};
	private _lineValidationLoss: SSLine = {m: 0, b: 0};

	constructor(private _trailDepth: number) {
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

	Update(epoch: number, logs: Logs) {
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

		this._lineAccuracy				= linearRegression(TRAILING_ACC_AS_XY);
		this._lineLoss					= linearRegression(TRAILING_LOSS_AS_XY);
		this._lineValidationAccuracy	= linearRegression(TRAILING_VAL_ACC_AS_XY);
		this._lineValidationLoss		= linearRegression(TRAILING_VAL_LOSS_AS_XY);

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
		const TEXT_OUT =
			this._averageLoss.toFixed(REPORTING_DIGITS_STAT)
			+ '(' + this._averageValidationLoss.toFixed(REPORTING_DIGITS_STAT) + ') '
			+ 'Δ ' + (this._averageLossDelta < 0 ? '' : ' ' ) + this._averageLossDelta.toFixed(2) + ', '
			+ 'm ' + (this._lineLoss.m < 0 ? '' : ' ' ) + this._lineLoss.m.toFixed(REPORTING_DIGITS_SLOPE)
			+ '(' + (this._lineValidationLoss.m < 0 ? '' : ' ' ) + this._lineValidationLoss.m.toFixed(REPORTING_DIGITS_SLOPE) + ') '
			+ '\\/ '
			+ this._averageAccuracy.toFixed(REPORTING_DIGITS_STAT)
			+ '(' + this._averageValidationAccuracy.toFixed(REPORTING_DIGITS_STAT) + '), '
			+ 'm ' + (this._lineAccuracy.m < 0 ? '' : ' ' ) + this._lineAccuracy.m.toFixed(REPORTING_DIGITS_SLOPE)
			+ '(' + (this._lineValidationAccuracy.m < 0 ? '' : ' ' ) + this._lineValidationAccuracy.m.toFixed(REPORTING_DIGITS_SLOPE) + ')';

		return TEXT_OUT;
	}
}


//NOTE: This must be kept in sync with the text written by WriteReport().
const REPORT_HEADER =  'EPOCH '
						+ 'LOSS(VALIDATION) '
						+ 'Δ L-V DELTA, '
						+ 'm LOSS-SLOPE(VALIDATION)'
						+ ' \\/ '
						+ 'ACCURACY(VALIDATION) '
						+ 'm ACCURACY-SLOPE(VALIDATION)';


const REPORTING_DIGITS_SLOPE = 6;
const REPORTING_DIGITS_STAT = 4;


Object.freeze(EpochStats);

export { EpochStats, REPORT_HEADER };
