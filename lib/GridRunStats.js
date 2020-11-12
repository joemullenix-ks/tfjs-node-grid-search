'use strict';


const { ModelTestStats } = require('./ModelTestStats');


class GridRunStats {
	constructor() {
		this._iterationResults = [];
	}

	AddIterationResult(id, modelParams, modelTestStats) {
		console.assert(typeof id === 'number');
		console.assert(id >= 0);
		console.assert(Math.floor(id) === id);
		console.assert(typeof modelParams === 'object');
		console.assert(modelTestStats instanceof ModelTestStats);

		this._iterationResults.push(modelTestStats);
	}

/*
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
*/
}


/*
//NOTE: This must be kept in sync with the text written by WriteReport().
GridRunStats.ReportGuide =  'EPOCH '
						+ 'LOSS '
						+ '(VALIDATION) '
						+ 'L-V DELTA, '
						+ 'LOSS SLOPE(VALIDATION)'
						+ ' || '
						+ 'ACCURACY'
						+ '(VALIDATION) '
						+ 'ACCURACY SLOPE(VALIDATION)';


const REPORTING_DIGITS_SLOPE = 6;
const REPORTING_DIGITS_STAT = 4;
*/


Object.freeze(GridRunStats);

exports.GridRunStats = GridRunStats;
