'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionEvaluation = void 0;
class PredictionEvaluation {
    constructor(_correct, _delta) {
        this._correct = _correct;
        this._delta = _delta;
        //NOTE: There is a high likelihood we'll enforce rules on these deltas, e.g. x >= 0; pending beta.
    }
    get correct() { return this._correct; }
    get delta() { return this._delta; }
}
exports.PredictionEvaluation = PredictionEvaluation;
Object.freeze(PredictionEvaluation);
//# sourceMappingURL=PredictionEvaluation.js.map