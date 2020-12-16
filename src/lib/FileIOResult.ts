'use strict';


import * as Utils from './Utils';


/**
 * Simple class for saving data from file reads.
 */
class FileIOResult {
	private _data = '';

	/**
	 * Creates an instance of FileIOResult.
	 */
	constructor() {
		// Lint gripes about empty constructors. Apperently this is good enough. Party on.
	}

	get data(): string { return this._data; }

	set data(data: string) {
		Utils.Assert(data !== '');

		this._data = data;
	}
}


Object.freeze(FileIOResult);

export { FileIOResult };
