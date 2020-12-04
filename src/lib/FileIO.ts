'use strict';


import * as FS_PROMISES from 'fs/promises';
import * as PATH_LIB from 'path';


//NOTE: Moved this one to ESM for Lint; had hesitated only because it kicks this:
//
//		"This module can only be referenced with ECMAScript imports/exports by turning on
//		the 'esModuleInterop' flag and referencing its default export.ts(2497)"
import SLASH from 'slash';


import { FileIOResult } from './FileIOResult';
import { Utils } from './Utils';


const FILE_IO = {
	ProduceResultsFilename: (): string => {
//TODO: hard-coder; both the regex and the filename prefix & suffix.
		const TIMESTAMP = (new Date()).toLocaleString();
		const FILTERED = TIMESTAMP.replace(/[^a-z0-9]/gi, '_');
		const LOWERED = FILTERED.toLowerCase();

		return 'Results_' + LOWERED + '.csv';
	},

	ReadDataFile: async (path: string, result: FileIOResult): Promise<void> => {
		console.assert(path !== '');

		try {
			result.data = await FS_PROMISES.readFile(path, 'utf8');
			return;
		}
		catch (e) {
			Utils.ThrowCaughtUnknown('Failed to read file: ' + path + '\n', e);
		}
	},

	WriteResultsFile: async (	fileName: string,
								directory: string,
								dataToWrite: string): Promise<void> => {
		console.assert(fileName !== '');

		const WRITE_PATH = PATH_LIB.join(directory, fileName);

		// correct for Unix/Windows path format
		SLASH(WRITE_PATH);

		if (dataToWrite === '') {
			console.warn('Writing empty file: ' + WRITE_PATH);
		}

		try {
			await FS_PROMISES.writeFile(
							WRITE_PATH,
							dataToWrite,
							'utf8');

			return;
		}
		catch (e) {
			Utils.ThrowCaughtUnknown('Failed to write file: ' + WRITE_PATH, e);
		}
	}
};


Object.freeze(FILE_IO);

export { FILE_IO as FileIO };