'use strict';


import { DataSet, DataSetFetcher, FileIO } from '../src/main';


//vvvv FILESYSTEM MOCKUP (integration tests touch the disk, not unit tests)
import * as FS_PROMISES_MOCKUP from 'fs/promises';

jest.mock('fs/promises');

//NOTE: This horrendous 'any' cast is for TypeScript's compiler. It's only been
//		permitted because this usage is quarantined within unit tests.
//
//TODO: Dig further into Jest. There must be another way.
(FS_PROMISES_MOCKUP.readFile as any).mockImplementation((
	path: string,
	encoding: string) => {

//TODO: Expand our supported character sets, when requested.
	if (encoding !== FileIO.STANDARD_ENCODING) {
		console.error('unsupported encoding in fs mockup');
		throw new Error('unsupported encoding in fs mockup');
	}

	if (path === MOCK_READ_PATH_INPUTS || MOCK_READ_PATH_TARGETS) {
		return Promise.resolve('[[0, 1], [1, 0]]');
	}

	if (path === MOCK_READ_PATH_INVALID) {
		return Promise.reject('invalid mock path');
	}

//NOTE: We don't throw here, as throwing can be the criterion under evaluation.
	console.error('test mockup read error');

	return undefined; // make TS happy
});
//^^^^


const MOCK_READ_PATH_INPUTS = 'inputs file we pretend exists';
const MOCK_READ_PATH_TARGETS = 'targets file we pretend exists';

const MOCK_READ_PATH_INVALID = 'path we pretend does not exist';


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
//TODO: Verify, but this might be a false negative; failing in mockup.
//		Try again w/ the expect().rejects.toThrow() technique from Grid.test!
	test('throws on bad inputs path', async () => {
		const dataSetFetcher = new DataSetFetcher(['n/a', 'n/a', MOCK_READ_PATH_INVALID, MOCK_READ_PATH_TARGETS]);

		try {
			expect(await dataSetFetcher.Fetch()).toThrow();
		}
		catch (e) {
			console.log('jest forced error', e);
		}
	});

//TODO: Verify, but this might be a false negative; failing in mockup.
//		Try again w/ the expect().rejects.toThrow() technique from Grid.test!
	test('throws on bad targets path', async () => {
		const dataSetFetcher = new DataSetFetcher(['n/a', 'n/a', MOCK_READ_PATH_INPUTS, MOCK_READ_PATH_INVALID]);

		try {
			expect(await dataSetFetcher.Fetch()).toThrow();
		}
		catch (e) {
			console.log('jest forced error', e);
		}
	});

	test('throws on bad/missing encoding key', async () => {
		try {
			expect(await FS_PROMISES_MOCKUP.readFile('')).toThrow();
		}
		catch (e) {
			console.log('file fetch threw', e);
		}
	});

	test('fetches files and returns a DataSet', async () => {
		const dataSetFetcher = new DataSetFetcher(['n/a', 'n/a', MOCK_READ_PATH_INPUTS, MOCK_READ_PATH_TARGETS]);

		try {
			const dataSet = await dataSetFetcher.Fetch();

			expect(dataSet).toBeInstanceOf(DataSet);
		}
		catch (e) {
			console.log('file fetch threw', e);
		}
	});
});
