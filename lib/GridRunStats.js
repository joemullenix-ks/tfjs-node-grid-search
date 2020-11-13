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

		// write a header for this CSV table

		let headerText = 'Iteration,Score,';

//TODO: Consider writing the full ModelTestStats details into this CSV dump.

		const MODEL_PARAMS_EXAMPLE = this._iterationResults[0]._modelParams;

		for (let k in MODEL_PARAMS_EXAMPLE) {
			headerText += k + ',';
		}

		// drop the trailing comma
		headerText = headerText.slice(0, -1);

		// write each iteration's details

		let iterationsTableText = '';

		this._iterationResults.forEach((value, index) => {
			iterationsTableText += index + ',' + value.score + ',';

			for (let k in value.modelParams) {
				iterationsTableText += value.modelParams[k] + ',';
			}

			// drop the trailing comma
			iterationsTableText = iterationsTableText.slice(0, -1);

			iterationsTableText += '\n';
		});

		// drop the trailing newline
		iterationsTableText = iterationsTableText.slice(0, -1);

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

		iterations.forEach((value, index) => {
			outgoingText += value.WriteReport() + '\n';
		});

		// drop the trailing newline
		outgoingText = outgoingText.slice(0, -1);

		return outgoingText;
	}
}


Object.freeze(GridRunStats);

exports.GridRunStats = GridRunStats;
