'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
test('instantiation; readonlys', () => {
    const CORRECT = true;
    const DELTA = -10;
    const predictionEvaluation = new main_1.PredictionEvaluation(CORRECT, DELTA);
    expect(predictionEvaluation).toBeInstanceOf(main_1.PredictionEvaluation);
    expect(predictionEvaluation.correct).toBe(CORRECT);
    expect(predictionEvaluation.delta).toBe(DELTA);
});
//# sourceMappingURL=PredictionEvaluation.test.js.map