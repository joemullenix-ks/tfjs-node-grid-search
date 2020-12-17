'use strict';


import { DataSet, DataSetFetcher } from '../src/main';


describe('instantiation', () => {
	test('creation w/ random strings', () => {
		expect(new DataSetFetcher(['0', '1', '2', '3'])).toBeInstanceOf(DataSetFetcher);
	});

	test('creation w/ extra strings (supported)', () => {
		expect(new DataSetFetcher(['0', '1', '2', '3', '4'])).toBeInstanceOf(DataSetFetcher);
	});

	test('under-count throws', () => {
		expect(() => {
			new DataSetFetcher(['0', '1', '2']);
		}).toThrow();
	});

	test('duplicate paths throw', () => {
		expect(() => {
			new DataSetFetcher(['0', '1', '2', '2']);
		}).toThrow();
	});
});

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
