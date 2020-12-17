'use strict';
import { PredictionEvaluation } from '../src/main';
test('instantiation; readonlys', () => {
    const CORRECT = true;
    const DELTA = -10;
    const predictionEvaluation = new PredictionEvaluation(CORRECT, DELTA);
    expect(predictionEvaluation).toBeInstanceOf(PredictionEvaluation);
    expect(predictionEvaluation.correct).toBe(CORRECT);
    expect(predictionEvaluation.delta).toBe(DELTA);
    const predictionEvaluationNoDelta = new PredictionEvaluation(CORRECT);
    expect(predictionEvaluationNoDelta).toBeInstanceOf(PredictionEvaluation);
    expect(predictionEvaluationNoDelta.correct).toBe(CORRECT);
    expect(predictionEvaluationNoDelta.delta).toBe(0);
});
//# sourceMappingURL=PredictionEvaluation.test.js.map