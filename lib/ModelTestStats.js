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
//TODO: Add the final loss and accuracy numbers, either here, or to another (3rd!) stats class.
//		I think it'll go here with this repurposed as a 'ModelRunStats', merging train and test.
//		We'll also include things like overfit, stuck, duration ... probably more.

		this._deltaCorrect = deltaCorrect;
		this._deltaIncorrect = deltaIncorrect;
		this._totalCorrect = totalCorrect;
		this._totalCases = totalCases;
	}

	CalculateScore() {
		return this._totalCorrect / this._totalCases;
	}

	WriteLineKeys() {
		return 'deltaCorrect,deltaIncorrect,totalCorrect,totalCases';
	}

	WriteLineValues() {
		return this._deltaCorrect
				+ ',' + this._deltaIncorrect
				+ ',' + this._totalCorrect
				+ ',' + this._totalCases;
	}
}


Object.freeze(ModelTestStats);

exports.ModelTestStats = ModelTestStats;
