'use strict';


const FS_PROMISES = require('fs/promises');
const PATH_LIB = require('path');
const SLASH = require('slash');


const FILE_IO = {
	ReadDataFile: async (path, result) => {
		console.assert(typeof path === 'string');
		console.assert(path !== '');
		console.assert(typeof result === 'object');

		try {
			result.data = await FS_PROMISES.readFile(path, 'utf8');
			return;
		}
		catch (err) {
			throw new Error('Failed to read file: ' + path + '; ' + err.code + ', ' + err.message);
		}
	},

	WriteResultsFile: async (fileName, directory, dataToWrite, result) => {
		console.assert(typeof fileName === 'string');
		console.assert(fileName !== '');
		console.assert(typeof directory === 'string');
		console.assert(typeof dataToWrite === 'string');
		console.assert(typeof result === 'object');

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
							(err) => {
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

exports.FileIO = FILE_IO;