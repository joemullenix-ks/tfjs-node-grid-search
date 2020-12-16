'use strict';


import {
	Axis,
	AxisSet,
	AxisSetTraverser,
	AxisTypes,
	ExponentialProgression,
	FibonacciProgression,
	LinearProgression
} from '../src/main';


describe('instantiation and readonlys', () => {
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

	const axes = [];

	axes.push(linearAxis);
	axes.push(fibonacciAxis);
	axes.push(exponentialAxis);

	const axisSet = new AxisSet(axes);

	const axisSetTraverser = new AxisSetTraverser(axisSet);

	test('basic creation', () => {
		expect(axisSetTraverser).toBeInstanceOf(AxisSetTraverser);
		expect(axisSetTraverser.traversed).toBe(false);

//NOTE: This could be dynamic, but that would mean effectively rewriting the
//		Progression class here. Nope.
		expect(axisSetTraverser.totalIterations).toBe(54);
	});


/*
	test('creation w/ random strings', () => {
		expect(new AxisSetTraverser(['0', '1', '2', '3'])).toBeInstanceOf(AxisSetTraverser);
	});

	test('creation w/ extra strings (supported)', () => {
		expect(new AxisSetTraverser(['0', '1', '2', '3', '4'])).toBeInstanceOf(AxisSetTraverser);
	});

	test('under-count throws', () => {
		expect(() => {
			new AxisSetTraverser(['0', '1', '2']);
		}).toThrow();
	});

	test('duplicate paths throw', () => {
		expect(() => {
			new AxisSetTraverser(['0', '1', '2', '2']);
		}).toThrow();
	});
*/
});

/*
describe('async file retrieval', () => {
	const PATH_INPUTS = 'data_inputs.txt';
	const PATH_TARGETS = 'data_targets.txt';

	const PATH_INVALID = 'should not exist.bad';

	test('fetches files and returns a DataSet', async () => {
		const dataSetFetcher = new DataSetFetcher(['n/a', 'n/a', PATH_INPUTS, PATH_TARGETS]);

		try {
			const dataSet = await dataSetFetcher.Fetch();

			expect(dataSet).toBeInstanceOf(DataSet);
		}
		catch (e) {
			console.log('file fetch threw', e);
		}
	});

	test('throws on bad inputs path', async () => {
		const dataSetFetcher = new DataSetFetcher(['n/a', 'n/a', PATH_INVALID, PATH_TARGETS]);

		try {
			expect(await dataSetFetcher.Fetch()).toThrow();
		}
		catch (e) {
			console.log('jest forced error', e);
		}
	});

	test('throws on bad targets path', async () => {
		const dataSetFetcher = new DataSetFetcher(['n/a', 'n/a', PATH_INPUTS, PATH_INVALID]);

		try {
			expect(await dataSetFetcher.Fetch()).toThrow();
		}
		catch (e) {
			console.log('jest forced error', e);
		}
	});
});
*/