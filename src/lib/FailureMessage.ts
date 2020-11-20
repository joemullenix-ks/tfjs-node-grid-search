'use strict';


class FailureMessage {
	private _text: string = '';

	constructor() {
	}

	get text() { return this._text; }

	set text(text: string) {
		console.assert(text !== '');

		this._text = text;
	}
}


Object.freeze(FailureMessage);

export { FailureMessage };
