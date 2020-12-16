'use strict';


import { DataSet } from '../src/main';


describe('instantiation', () => {
	const INPUTS_ONE = [0];
	const INPUTS_TWO = [0, 0];
	const TARGETS = [[0]];

	test('creation', () => {
		expect(new DataSet(INPUTS_ONE, TARGETS)).toBeInstanceOf(DataSet);
	});

	test('mismatch throws', () => {
		expect(() => {
			new DataSet(INPUTS_TWO, TARGETS);
		}).toThrow();
	});
});

describe('readonlys', () => {
	const INPUTS_ONE = [0];
	const TARGETS = [[0]];

	const dataSet = new DataSet(INPUTS_ONE, TARGETS);

	expect(dataSet.inputs.length).toBe(1);
	expect(dataSet.targets.length).toBe(1);
});
