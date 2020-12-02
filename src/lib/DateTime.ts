'use strict';


//DOOM: TEMP! Testing npm namespaces


class DateTime {
	_data = '';

	constructor() {
		// Lint gripes about empty constructors. Apperently this is good enough. Party on.
	}

	get data(): string { return this._data; }

	set data(data: string) {
		console.assert(data !== '');

		this._data = data;
	}
}


Object.freeze(DateTime);

export { DateTime };
