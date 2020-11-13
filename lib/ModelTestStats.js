'use strict';


class ModelTestStats {
	constructor(deltaCorrect,
				deltaIncorrect,
				totalCorrect,
				totalCases) {
		console.assert(typeof deltaCorrect === 'number');
		console.assert(typeof deltaIncorrect === 'number');
		console.assert(typeof totalCorrect === 'number');
		console.assert(Math.floor(totalCorrect) === totalCorrect);
		console.assert(typeof totalCases === 'number');
		console.assert(totalCases >= totalCorrect);
		console.assert(Math.floor(totalCases) === totalCases);

		this._deltaCorrect = deltaCorrect;
		this._deltaIncorrect = deltaIncorrect;
		this._totalCorrect = totalCorrect;
		this._totalCases = totalCases;
	}

	CalculateScore() {
		return this._totalCorrect / this._totalCases;
	}
}


Object.freeze(ModelTestStats);

exports.ModelTestStats = ModelTestStats;
