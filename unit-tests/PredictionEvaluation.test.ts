'use strict';


import { PredictionEvaluation } from '../src/main';


test('instantiation; readonlys', () => {
	const CORRECT = true;
	const DELTA = -10;

	const predictionEvaluation = new PredictionEvaluation(CORRECT, DELTA);

	expect(predictionEvaluation).toBeInstanceOf(PredictionEvaluation);

	expect(predictionEvaluation.correct).toBe(CORRECT);
	expect(predictionEvaluation.delta).toBe(DELTA);
});