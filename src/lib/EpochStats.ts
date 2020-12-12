'use strict';


import { Logs } from '@tensorflow/tfjs-node';


import { linearRegression } from 'simple-statistics';


import * as Utils from './Utils';


//NOTE: This depends on simple-statistics(tm), which doesn't use a type for its basic line object.
type SSLine = {m: number, b: number}; // slope and intercept


/**
 * Manages the training statistics for one model. TensorFlow produces stats each
 * epoch. This class records them, and maintains trailing averages to smooth
 * spikes and dips. It calculates deltas and slopes for these averages. This
 * information can be used to detect problematic situations such as overfitting.
 * EpochStats also has text helpers for logging and output as CSV.
 */
class EpochStats {
	private _samplesAccuracy: Array<number> = [];
	private _samplesLoss: Array<number> = [];
	private _samplesValidationAccuracy: Array<number> = [];
	private _samplesValidationLoss: Array<number> = [];
	private _averageAccuracy = 0;
	private _averageLoss = 0;
	private _averageLossDelta = 0;
	private _averageValidationAccuracy = 0;
	private _averageValidationLoss = 0;

	private _lineAccuracy: SSLine = {m: 0, b: 0};
	private _lineLoss: SSLine = {m: 0, b: 0};
	private _lineValidationAccuracy: SSLine = {m: 0, b: 0};
	private _lineValidationLoss: SSLine = {m: 0, b: 0};

	/**
	 * Creates an instance of EpochStats.
	 * @param {number} _trailDepth Total samples in a (simple) trailing average.
	 */
	constructor(private _trailDepth: number) {
		console.assert(this._trailDepth > 0);
		console.assert(Math.floor(this._trailDepth) === this._trailDepth);
	}

	get averageAccuracy(): number { return this._averageAccuracy; }
	get averageLoss(): number { return this._averageLoss; }
	get averageValidationAccuracy(): number { return this._averageValidationAccuracy; }
	get averageValidationLoss(): number { return this._averageValidationLoss; }
	get lineAccuracy(): SSLine { return this._lineAccuracy; }
	get lineLoss(): SSLine { return this._lineLoss; }
	get lineValidationAccuracy(): SSLine { return this._lineValidationAccuracy; }
	get lineValidationLoss(): SSLine { return this._lineValidationLoss; }

	/**
	 * Takes the results of an epoch, and updates the trailing averages, deltas
	 * and slopes.
	 * @param {number} epoch Iteration count from model fit; currently unused.
	 * @param {Logs} logs A TensorFlow object with the latest values for
	 *					  accuracy, loss, validation-accuracy and
	 *					  validation-loss.
	 */
	Update(epoch: number, logs: Logs): void {
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
	WriteCSVLineKeys(): string {
		return 'averageAccuracy,averageLoss,averageValidationAccuracy,averageValidationLoss,slopeAccuracy,slopeLoss,slopeValidationAccuracy,slopeValidationLoss';
	}

	WriteCSVLineValues(): string {
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

	/**
	 * Generates a one-line text report with the following:
	 * <ul>
	 *   <li>all of the trailing averages</li>
	 *   <li>the slope of each average (accuracy, loss, validation-accuracy and validation-loss)</li>
	 *   <li>relevant deltas between the training and validation values</li>
	 * <ul>
	 * @return {string}
	 */
	WriteReport(): string {
//NOTE: These '< 0' ternaries add a space before each positive number. This is
//		done to maintain float alignement on the ".". This is useful when
//		examing numeric details in a large Matrix-waterfall of digits.
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

	/**
	 * Gets the header that goes with {@link WriteReport}.
	 * @static
	 * @return {string}
	 */
	static WriteReportHeader(): string {
//NOTE: This must be kept in sync with the text written by WriteReport().
		return 'EPOCH '
				+ 'LOSS(VALIDATION) '
				+ 'Δ L-V DELTA, '
				+ 'm LOSS-SLOPE(VALIDATION)'
				+ ' \\/ '
				+ 'ACCURACY(VALIDATION) '
				+ 'm ACCURACY-SLOPE(VALIDATION)';
	}
}


const REPORTING_DIGITS_SLOPE = 6;
const REPORTING_DIGITS_STAT = 4;


Object.freeze(EpochStats);

export { EpochStats };
