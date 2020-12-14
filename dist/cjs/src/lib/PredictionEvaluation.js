'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionEvaluation = void 0;
/**
 * Container for the right/wrong score of a generalization case, as well as an
 * arbitrary, user-defined delta. The delta is intended for accuracy/quality
 * ratings.
 */
class PredictionEvaluation {
    /**
     * Creates an instance of PredictionEvaluation.
     * @param {boolean} _correct Whether the prediction is acceptable.
     * @param {number} _delta The accuracy or quality of the prediction.
     */
    constructor(_correct, _delta) {
        this._correct = _correct;
        this._delta = _delta;
    }
    get correct() { return this._correct; }
    get delta() { return this._delta; }
}
exports.PredictionEvaluation = PredictionEvaluation;
Object.freeze(PredictionEvaluation);
//# sourceMappingURL=PredictionEvaluation.js.map