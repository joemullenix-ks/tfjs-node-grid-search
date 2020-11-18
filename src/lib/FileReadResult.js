'use strict';


class FileReadResult {
	constructor() {
		this._data = '';
	}

	get data() { return this._data; }

	set data(data) {
		console.assert(typeof data === 'string');
		console.assert(data !== '');

		this._data = data;
	}
}


Object.freeze(FileReadResult);

exports.FileReadResult = FileReadResult;
