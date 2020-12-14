/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
import { PredictionEvaluation } from '../src/lib/PredictionEvaluation';
test('instantiation; readonlys', () => {
    const CORRECT = true;
    const DELTA = -10;
    const predictionEvaluation = new PredictionEvaluation(CORRECT, DELTA);
    expect(predictionEvaluation).toBeInstanceOf(PredictionEvaluation);
    expect(predictionEvaluation.correct).toBe(CORRECT);
    expect(predictionEvaluation.delta).toBe(DELTA);
});
//# sourceMappingURL=PredictionEvaluation.test.js.map