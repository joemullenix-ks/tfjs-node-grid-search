/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const PredictionEvaluation_1 = require("../src/lib/PredictionEvaluation");
test('instantiation; readonlys', () => {
    const CORRECT = true;
    const DELTA = -10;
    const predictionEvaluation = new PredictionEvaluation_1.PredictionEvaluation(CORRECT, DELTA);
    expect(predictionEvaluation).toBeInstanceOf(PredictionEvaluation_1.PredictionEvaluation);
    expect(predictionEvaluation.correct).toBe(CORRECT);
    expect(predictionEvaluation.delta).toBe(DELTA);
});
//# sourceMappingURL=PredictionEvaluation.test.js.map