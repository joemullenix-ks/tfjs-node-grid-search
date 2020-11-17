'use strict';


class FailureMessage {
	constructor() {
		this._text = '';
	}

	get text() { return this._text; }

	set text(text) {
		console.assert(typeof text === 'string');
		console.assert(text !== '');

		this._text = text;
	}
}


Object.freeze(FailureMessage);

exports.FailureMessage = FailureMessage;
