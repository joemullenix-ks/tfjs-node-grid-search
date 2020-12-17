'use strict';


/**
 * Container for the right/wrong score of a generalization case, as well as an
 * arbitrary, user-defined delta. The delta is intended for accuracy/quality
 * ratings.
 */
class PredictionEvaluation {
	private _delta = 0.0;

	/**
	 * Creates an instance of PredictionEvaluation.
	 * @param {boolean} _correct Whether the prediction is acceptable.
	 * @param {number} [delta] The accuracy or quality of the prediction.
	 */
	constructor(private _correct: boolean, delta?: number) {
		if (typeof delta !== 'number') {
			return;
		}

		this._delta = delta;
	}

	get correct(): boolean { return this._correct; }
	get delta(): number { return this._delta; }
}


Object.freeze(PredictionEvaluation);

export { PredictionEvaluation };
