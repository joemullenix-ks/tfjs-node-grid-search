'use strict';


import { FileIO, FileIOResult } from '../src/main';


//vvvv FILESYSTEM MOCKUP, for Jest
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

	if (path === MOCK_READ_PATH_VALID) {
		return Promise.resolve(MOCK_DATA_TO_READ);
	}

	if (path === MOCK_READ_PATH_INVALID) {
		return Promise.reject('invalid mock path');
	}

//NOTE: We don't throw here, as throwing can be the criterion under evaluation.
	console.error('test mockup read error');

	return undefined; // make TS happy
});

(FS_PROMISES_MOCKUP.writeFile as any).mockImplementation((
	path: string,
	_data: string,
	encoding: string) => {

//TODO: Expand our supported character sets, when requested.
	if (encoding !== FileIO.STANDARD_ENCODING) {
		console.error('unsupported encoding in fs mockup');
		throw new Error('unsupported encoding in fs mockup');
	}

	// success/resolve() cases

	const BOTH_VALID = FileIO.WriteSystemPath(MOCK_DIRECTORY_VALID, MOCK_WRITE_FILE_VALID);

	if (path === BOTH_VALID) {
		return Promise.resolve('write file at path');
	}

	const EMPTY_DIRECTORY = FileIO.WriteSystemPath('', MOCK_WRITE_FILE_VALID);

	if (path === EMPTY_DIRECTORY) {
		return Promise.resolve('write file at root');
	}

	// failure/reject() cases

	const BAD_DIRECTORY = FileIO.WriteSystemPath(MOCK_DIRECTORY_INVALID, MOCK_WRITE_FILE_VALID);

	if (path === BAD_DIRECTORY) {
		return Promise.reject('failure: invalid directory');
	}

//NOTE: We don't throw here, as throwing can be the criterion under evaluation.
	console.error('test mockup write error; path: ' + path);

	return undefined; // make TS happy
});
//^^^^


const MOCK_DATA_TO_READ			= '[[1,0,0,0,0],[0,0,1,0,0]]';
const MOCK_DATA_READ_SIZE		= MOCK_DATA_TO_READ.length;

const MOCK_DATA_TO_WRITE		= 'data never to be written by the mock filesystem';
const MOCK_DIRECTORY_INVALID	= 'mock directory invalid';
const MOCK_DIRECTORY_VALID		= 'mock directory valid';
const MOCK_READ_PATH_INVALID	= 'mock read path invalid';
const MOCK_READ_PATH_VALID		= 'mock read path valid';
const MOCK_WRITE_FILE_VALID		= 'mock write file valid';


test('generate valid csv filename', () => {
	expect(typeof FileIO.ProduceResultsFilename()).toBe('string');
	expect(FileIO.ProduceResultsFilename()).toMatch(/Results_/);
	expect(FileIO.ProduceResultsFilename()).toMatch(/.csv/);
});

describe('async file read', () => {
	test('finds file', () => {
		const FILE_IO_RESULT = new FileIOResult();

		expect(async () => {
			await FileIO.ReadDataFile(MOCK_READ_PATH_VALID, FILE_IO_RESULT);
		}).not.toThrow();
	});

	test('throws on empty filepath', () => {
		const FILE_IO_RESULT = new FileIOResult();

//NOTE: This should be caught by FileIO, before reaching the filesystem.
		return expect(async () => {
			await FileIO.ReadDataFile('', FILE_IO_RESULT);
		}).rejects.toThrow();
	});

//KEEP: Although this is very similar to the next test, it doesn't work. The
//		differences are very subtle. Namely, we need to return the expect()
//		promise, and chain a 'rejects' before requiring the throw.
//
// 	test('throws on bad filepath', () => {
// 		const FILE_IO_RESULT = new FileIOResult();
//
// 		expect(async () => {
// 			await FileIO.ReadDataFile(MOCK_READ_PATH_VALID, FILE_IO_RESULT);   // FAILS
// 			await FileIO.ReadDataFile(MOCK_READ_PATH_INVALID, FILE_IO_RESULT); // Also!?
// 		}).toThrow();
// 	});

	test('throws on bad filepath', () => {
		const FILE_IO_RESULT = new FileIOResult();

		return expect(async () => {
			await FileIO.ReadDataFile(MOCK_READ_PATH_INVALID, FILE_IO_RESULT);
		}).rejects.toThrow();
	});

	test('saves data to results package', async () => {
		const FILE_IO_RESULT = new FileIOResult();

		await FileIO.ReadDataFile(MOCK_READ_PATH_VALID, FILE_IO_RESULT);

		expect(FILE_IO_RESULT.data).not.toBe('');

		expect(FILE_IO_RESULT.data.length).toBe(MOCK_DATA_READ_SIZE);
	});
});

describe('async file write', () => {
	test('does not throw w root directory', () => {
		expect(async () => {
			await FileIO.WriteResultsFile(MOCK_WRITE_FILE_VALID, '', MOCK_DATA_TO_WRITE);
		}).not.toThrow();
	});

	test('does not throw w valid directory', () => {
		expect(async () => {
			await FileIO.WriteResultsFile(MOCK_WRITE_FILE_VALID, MOCK_DIRECTORY_VALID, MOCK_DATA_TO_WRITE);
		}).not.toThrow();
	});

	test('throws on empty filename', () => {
//NOTE: This should be caught by FileIO, before reaching the filesystem.
		return expect(async () => {
			await FileIO.WriteResultsFile('', '', MOCK_DATA_TO_WRITE);
		}).rejects.toThrow();
	});

	test('throws on bad directory', () => {
		return expect(async () => {
			await FileIO.WriteResultsFile(MOCK_WRITE_FILE_VALID, MOCK_DIRECTORY_INVALID, MOCK_DATA_TO_WRITE);
		}).rejects.toThrow();
	});

	test('returns cleanly', async () => {
//NOTE: Took another approach here, and it came out much more cleanly than our
//		previous asynchronous tests (the reads, too).
//
//TODO: Once we're finished, make another pass through all async/await tests.
		try {
			expect(await FileIO.WriteResultsFile(MOCK_WRITE_FILE_VALID, '', MOCK_DATA_TO_WRITE)).toBeUndefined();
		}
		catch (e) {
			console.log('write-file-return-check threw', e);
		}
	});

	test('does not throw on empty data', () => {
		try {
			expect(async () => {
				await FileIO.WriteResultsFile(MOCK_WRITE_FILE_VALID, '', '');
			}).not.toThrow();
		}
		catch (e) {
			console.log('write-empty-file threw', e);
		}
	});
});
