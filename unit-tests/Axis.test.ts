/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';


import {
	Axis,
	AxisNames,
	AxisTypes,
	ExponentialProgression,
	FibonacciProgression,
	LinearProgression
} from '../src/main';


describe('valid instantiation and readonlys', () => {
	const linearAxis = new Axis(
		AxisTypes.BATCH_SIZE,
		8,
		16,
		new LinearProgression(4)
	);

	const fibonacciAxis = new Axis(
		AxisTypes.NEURONS,
		10,
		18,
		new FibonacciProgression(0)
	);

	const exponentialAxis = new Axis(
		AxisTypes.LAYERS,
		1,
		5,
		new ExponentialProgression(3, 1)
	);

	test('basic creation', () => {
		expect(linearAxis).toBeInstanceOf(Axis);
		expect(fibonacciAxis).toBeInstanceOf(Axis);
		expect(exponentialAxis).toBeInstanceOf(Axis);

		expect(linearAxis.type).toBe(AxisTypes.BATCH_SIZE);
		expect(fibonacciAxis.type).toBe(AxisTypes.NEURONS);
		expect(exponentialAxis.type).toBe(AxisTypes.LAYERS);

		expect(linearAxis.typeName).toBe(AxisNames.BATCH_SIZE);
		expect(fibonacciAxis.typeName).toBe(AxisNames.NEURONS);
		expect(exponentialAxis.typeName).toBe(AxisNames.LAYERS);
	});
});

describe('invalid instantiation', () => {
	test('bad type enum', () => {
		// negative index
		expect(() => {
			const axis = new Axis(
				-1,
				0,
				1,
				new LinearProgression(1)
			);
		}).toThrowError();

		// float index
		expect(() => {
			const axis = new Axis(
				0.5,
				0,
				1,
				new LinearProgression(1)
			);
		}).toThrowError();

		// over index
		expect(() => {
			const axis = new Axis(
				AxisTypes._TOTAL,
				0,
				1,
				new LinearProgression(1)
			);
		}).toThrowError();
	});

	test('bad bounds', () => {
		// low bound begin
		expect(() => {
			const axis = new Axis(
				AxisTypes.BATCH_SIZE,
				-1,
				0,
				new LinearProgression(1)
			);
		}).toThrowError();

		// low bound end
		expect(() => {
			const axis = new Axis(
				AxisTypes.BATCH_SIZE,
				0,
				-1,
				new LinearProgression(1)
			);
		}).toThrowError();
	});

	test('bad bounds: BATCH_SIZE', () => {
		expect(() => {
			const axis = new Axis(
				AxisTypes.BATCH_SIZE,
				0,
				0,
				new LinearProgression(1)
			);
		}).toThrowError();
	});
});
