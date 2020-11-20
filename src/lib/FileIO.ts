'use strict';


const FS_PROMISES = require('fs/promises');
const PATH_LIB = require('path');
const SLASH = require('slash');


import { FileIOResult } from './FileIOResult';


const FILE_IO = {
	ProduceResultsFilename: () => {
//TODO: hard-coder; both the regex and the filename prefix & suffix.
		const TIMESTAMP = (new Date()).toLocaleString();
		const FILTERED = TIMESTAMP.replace(/[^a-z0-9]/gi, '_');
		const LOWERED = FILTERED.toLowerCase();

		return 'Results_' + LOWERED + '.csv';
	},

	ReadDataFile: async (path: string, result: FileIOResult) => {
		console.assert(path !== '');

		try {
			result.data = await FS_PROMISES.readFile(path, 'utf8');
			return;
		}
		catch (err) {
			throw new Error('Failed to read file: ' + path + '; ' + err.code + ', ' + err.message);
		}
	},

	WriteResultsFile: async (	fileName: string,
								directory: string,
								dataToWrite: string,
								result: FileIOResult) => {
		console.assert(fileName !== '');

		const WRITE_PATH = PATH_LIB.join(directory, fileName);

		// correct for Unix/Windows path format
		SLASH(WRITE_PATH);

		if (dataToWrite === '') {
			console.warn('Writing empty file: ' + WRITE_PATH);
		}

		try {
			result.data = await FS_PROMISES.writeFile(
							WRITE_PATH,
							dataToWrite,
							'utf8',
//NOTE: This is nether TF nor any, technically, but it still needs to be confirmed. I picked "Error" out of
//		the wind.
//TODO: Come to think of it, I don't even believe this ever tripped, during testing. Seems like the
//		catch block was the only point-of-failure ... so confirm!
//
//[[TF ANY]]
							(err: Error) => {
//NOTE: It seems that this doesn't get called, at least not for successful writes. The outer try/catch works,
//		however. It catches bad-path and bad-content. Maybe it precludes this? Unsure, but it's not hurting
//		anything, so it stays.
								if (err) {
									throw err;
								}

								console.log('file written');
							});

			return;
		}
		catch (err) {
			throw new Error('Failed to write file: ' + WRITE_PATH + '; ' + err.code + ', ' + err.message);
		}
	}
};


Object.freeze(FILE_IO);

export {FILE_IO};