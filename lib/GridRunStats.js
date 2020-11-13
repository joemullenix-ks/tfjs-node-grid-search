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

//TODO: Consider lifting this into a class; ...how it's used is still very TBD.
		this._iterationResults.push({
										id: id,
										modelParams: modelParams,
										modelTestStats: modelTestStats,
										score: modelTestStats.CalculateScore()
									});
	}

	WriteCSV() {
		if (this._iterationResults.length === 0) {
			return 'no data';
		}

		// write a header for this CSV table

		let headerText = 'Iteration,Score,';

//TODO: Consider writing the full ModelTestStats details into this CSV dump.

		const MODEL_PARAMS_EXAMPLE = this._iterationResults[0].modelParams;

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
			outgoingText += 'Iteration: ' + index + ', Score: ' + (100 * value.score).toFixed(1) + '%' + '\n';
		});

		// drop the trailing newline
		outgoingText = outgoingText.slice(0, -1);

		return outgoingText;
	}
}


//doom ... maybe
GridRunStats.WriteIterationDescriptor = (modelParams) => {

}


Object.freeze(GridRunStats);

exports.GridRunStats = GridRunStats;
