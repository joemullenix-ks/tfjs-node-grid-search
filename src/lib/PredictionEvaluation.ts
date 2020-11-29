'use strict';


class PredictionEvaluation {
	constructor(private _correct: boolean,
				private _delta: number) {
//NOTE: There is a high likelihood we'll enforce rules on these deltas, e.g. x >= 0; pending beta.
	}

	get correct(): boolean { return this._correct; }
	get delta(): number { return this._delta; }
}


Object.freeze(PredictionEvaluation);

export { PredictionEvaluation };
