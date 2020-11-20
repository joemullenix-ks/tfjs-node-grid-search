'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionEvaluation = void 0;
var PredictionEvaluation = /** @class */ (function () {
    function PredictionEvaluation(_correct, _delta) {
        this._correct = _correct;
        this._delta = _delta;
        //NOTE: There is a high likelihood we'll enforce rules on these deltas, e.g. x >= 0; pending beta.
    }
    Object.defineProperty(PredictionEvaluation.prototype, "correct", {
        get: function () { return this._correct; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PredictionEvaluation.prototype, "delta", {
        get: function () { return this._delta; },
        enumerable: false,
        configurable: true
    });
    return PredictionEvaluation;
}());
exports.PredictionEvaluation = PredictionEvaluation;
Object.freeze(PredictionEvaluation);
//# sourceMappingURL=PredictionEvaluation.js.map