'use strict';


const { IterationResult } = require('./IterationResult');
const { ModelTestStats } = require('./ModelTestStats');


class GridRunStats {
	constructor() {
		this._iterationResults = [];
	}

	AddIterationResult(iterationResult) {
		console.assert(iterationResult instanceof IterationResult);

		this._iterationResults.push(iterationResult);
	}

	WriteCSV() {
		if (this._iterationResults.length === 0) {
			return 'no data';
		}

		// write the header of the CSV table
		let headerText = 'Iteration,Score,'
							+ this._iterationResults[0].WriteModelParamHeader()
							+ ','
							+ this._iterationResults[0].WriteTestStatsHeader();

		// write the body of the CSV table

		let iterationsTableText = '';

		this._iterationResults.forEach((value, index) => {
			iterationsTableText += index + ',' + value.score + ',';

			// first the model params...
			iterationsTableText += value.WriteModelParamValues();

			iterationsTableText += ',';

			// ...then the test statx
			iterationsTableText += value.WriteTestStatsValues();

			iterationsTableText += '\n';
		});

		// drop the trailing newline
		iterationsTableText = iterationsTableText.slice(0, -1);

//TODO: Consider writing the full ModelTestStats details into this CSV, as well.

		return headerText + '\n' + iterationsTableText;
	}

	WriteReport(sortByScore) {
		console.assert(typeof sortByScore === 'boolean');

		let iterations = this._iterationResults;

		if (sortByScore) {
			// create a shallow clone...
			iterations = this._iterationResults.slice();

			// ...then sort it by score, descending (i.e. best score first)
			iterations.sort((a, b) => {return b.score - a.score;});
		}

		let outgoingText = '';

		iterations.forEach((value) => {
			outgoingText += value.WriteReport() + '\n';
		});

		// drop the trailing newline
		outgoingText = outgoingText.slice(0, -1);

		return outgoingText;
	}
}


Object.freeze(GridRunStats);

exports.GridRunStats = GridRunStats;
