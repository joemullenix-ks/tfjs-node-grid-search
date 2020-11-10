'use strict';


const FS_PROMISES = require('fs/promises');


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
			throw new Error('Failed to read file: ' + path + '; ' + err);
		}
	}
};


Object.freeze(FILE_IO);

exports.FileIO = FILE_IO;