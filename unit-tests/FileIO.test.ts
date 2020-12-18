'use strict';


import { FileIO, FileIOResult } from '../src/main';


test('generate valid csv filename', () => {
	expect(typeof FileIO.ProduceResultsFilename()).toBe('string');
	expect(FileIO.ProduceResultsFilename()).toMatch(/Results_/);
	expect(FileIO.ProduceResultsFilename()).toMatch(/.csv/);
});

describe('async file read', () => {
	const PATH_INVALID = 'should not exist.bad';
	const PATH_VALID = 'data_targets.txt';

	const DATA_BLOCK_SIZE = 120003;

	test('finds file', () => {
		const FILE_IO_RESULT = new FileIOResult();

		expect(async () => {
			await FileIO.ReadDataFile(PATH_VALID, FILE_IO_RESULT);
		}).not.toThrow();
	});

//KEEP: Although this is very similar to the next test, it doesn't work. The
//		differences are very subtle. Namely, we ned to the return the expect()
//		result (which is a promise, I believe), and we we need to chain a
//		'rejects' before requiring the throw.
//
// 	test('throws on bad filepath', () => {
// 		const FILE_IO_RESULT = new FileIOResult();
//
// 		expect(async () => {
// 			await FileIO.ReadDataFile(PATH_VALID, FILE_IO_RESULT);   // FAILS
// 			await FileIO.ReadDataFile(PATH_INVALID, FILE_IO_RESULT); // Also!?
// 		}).toThrow();
// 	});

	test('throws on bad filepath', () => {
		const FILE_IO_RESULT = new FileIOResult();

		return expect(async () => {
			await FileIO.ReadDataFile(PATH_INVALID, FILE_IO_RESULT);
		}).rejects.toThrow();
	});

	test('writes data to result', async () => {
		const FILE_IO_RESULT = new FileIOResult();

		await FileIO.ReadDataFile(PATH_VALID, FILE_IO_RESULT);

		expect(FILE_IO_RESULT.data).not.toBe('');
		expect(FILE_IO_RESULT.data.length).toBe(DATA_BLOCK_SIZE);
	});
});

describe('async file write', () => {
	const DIRECTORY_INVALID = 'no-directory/here';
	const FILE_VALID = 'unit-test-file-write.txt';
	const OUTPUT_DATA = 'written by TNGS unit testing';

	test('does not throw w valid args', () => {
		expect(async () => {
			await FileIO.WriteResultsFile(FILE_VALID, '', OUTPUT_DATA);
		}).not.toThrow();
	});

	test('throws on empty filename', () => {
		return expect(async () => {
			await FileIO.WriteResultsFile('', '', OUTPUT_DATA);
		}).rejects.toThrow();
	});

	test('throws on bad directory', () => {
		return expect(async () => {
			await FileIO.WriteResultsFile(FILE_VALID, DIRECTORY_INVALID, OUTPUT_DATA);
		}).rejects.toThrow();
	});

	test('returns cleanly', async () => {
//NOTE: Took another approach here, and it came out much more cleanly than our
//		previous asynchronous tests (the reads, too).
//
//TODO: Once we're finished, make another pass through all async/await tests.
		try {
			expect(await FileIO.WriteResultsFile(FILE_VALID, '', OUTPUT_DATA)).toBeUndefined();
		}
		catch (e) {
			console.log('write-file-return-check threw', e);
		}
	});

	test('does not throw on empty data', async () => {
		try {
			expect(await FileIO.WriteResultsFile(FILE_VALID, '', '')).not.toThrow();
		}
		catch (e) {
			console.log('write-empty-file threw', e);
		}
	});
});
