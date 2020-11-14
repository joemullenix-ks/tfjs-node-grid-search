'use strict';


const { ModelTestStats } = require("./ModelTestStats");


class IterationResult {
	constructor(id, descriptor, modelParams, modelTestStats) {
		console.assert(typeof id === 'number');
		console.assert(id >= 0);
		console.assert(typeof descriptor === 'string');
		console.assert(descriptor !== '');
		console.assert(Math.floor(id) === id);
		console.assert(typeof modelParams === 'object');
		console.assert(modelTestStats instanceof ModelTestStats);

		this._id = id;
		this._descriptor = descriptor;
		this._modelParams = modelParams;
		this._modelTestStats = modelTestStats;

		this._score = this._modelTestStats.CalculateScore();
	}

	get score() { return this._score; }

//TODO: Looks like we need to abstract a proper ModelParams.
	WriteModelParamHeader() {
		let textOut = '';

		for (let k in this._modelParams) {
			textOut += k + ',';
		}

		// drop the trailing comma
		textOut = textOut.slice(0, -1);

		return textOut;
	}

//TODO: Looks like we need to abstract a proper ModelParams.
	WriteModelParamValues() {
		let textOut = '';

		for (let k in this._modelParams) {
			// check every string for file-breakers, while we're here

//PERF: This is potentially overkill (we validate these on their way into the model), and it could matter
//		to larger/longer runs ... at least theoretically.
//		I'm keeping it because that initial validation is not done w/ CSV writes in mind. It's much more looking
//		at proper uint/bool/string.
//		Redundancy is good, and if our file writes suffer, it'll be obvious.
			IterationResult.ValidateForCSV(this._modelParams[k]);

			textOut += this._modelParams[k] + ',';
		}

		// drop the trailing comma
		textOut = textOut.slice(0, -1);

		return textOut;
	}

	WriteReport() {
		return 'Iteration: ' + this._id + ', '
				+ 'Score: ' + (100 * this._score).toFixed(1) + '%, '
				+ 'Dynamics: ' + this._descriptor;
	}
}


IterationResult.ValidateForCSV = (x) => {
	// allows any input (that's the point)

	const AS_STRING = x.toString();

	if (AS_STRING.indexOf(',') === -1 && AS_STRING.indexOf('\n') === -1) {
		return;
	}

	throw new Error('Value contains comma or newline (which breaks CSV): ' + x + ', ' + AS_STRING);
};


Object.freeze(IterationResult);

exports.IterationResult = IterationResult;
