'use strict';


class FileReadResult {
	_data: string = '';

	constructor() {
	}

	get data() { return this._data; }

	set data(data) {
		console.assert(data !== '');

		this._data = data;
	}
}


Object.freeze(FileReadResult);

export { FileReadResult };
