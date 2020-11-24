'use strict';


import * as FS_PROMISES from 'fs/promises';
import * as PATH_LIB from 'path';


//NOTE: Not yet ready to move this one to ESM, only because I don't want to bring in added
//		module variability until the bundled package is ready. Stay tuned.
//
//		"This module can only be referenced with ECMAScript imports/exports by turning on
//		the 'esModuleInterop' flag and referencing its default export.ts(2497)"
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
//NOTE: I picked "Error" here as the safest bet. This never tripped during testing. Even w/o the try/catch.
//		So I'm guessing it isn't actually used by the 'promises' variant of node's filesystem lib.
							(err: Error) => {
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

export { FILE_IO as FileIO };