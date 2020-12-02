'use strict';


//DOOM: TEMP! Testing npm namespaces


class DateTime {
	private _data = '';

	constructor() {
		console.warn('THIS IS A TEMP DOOMED CLASS');
	}

	get data(): string { return this._data; }

	set data(data: string) {
		console.assert(data !== '');

		this._data = data;
	}
}


Object.freeze(DateTime);

export { DateTime };
