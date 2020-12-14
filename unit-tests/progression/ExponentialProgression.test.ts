/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';


import { ExponentialProgression } from '../../src/lib/progression/ExponentialProgression';


test('instantiation; advance and reset', () => {
	expect(() => {
		const INVALID_BASE = 1;

		const exponentialProgression = new ExponentialProgression(INVALID_BASE, 1);
	}).toThrow();

	expect(() => {
		const INVALID_SCALE = -1;

		const exponentialProgression = new ExponentialProgression(2, INVALID_SCALE);
	}).toThrow();

	const exponentialProgression = new ExponentialProgression(2, 1);

	expect(exponentialProgression).toBeInstanceOf(ExponentialProgression);

	expect(exponentialProgression.value).toBe(0);

	exponentialProgression.Advance();

	expect(exponentialProgression.value).toBe(1);

	exponentialProgression.Advance();

	expect(exponentialProgression.value).toBe(2);

	exponentialProgression.Advance();

	expect(exponentialProgression.value).toBe(4);

	exponentialProgression.Advance();

	expect(exponentialProgression.value).toBe(8);

	exponentialProgression.Reset();

	expect(exponentialProgression.value).toBe(0);
});
