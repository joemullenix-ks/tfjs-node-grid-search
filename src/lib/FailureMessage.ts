'use strict';


class FailureMessage {
	private _text = '';

	constructor() {
		// Lint gripes about empty constructors. Apperently this is good enough. Party on.
	}

	get text(): string { return this._text; }

	set text(text: string) {
		console.assert(text !== '');

		this._text = text;
	}
}


Object.freeze(FailureMessage);

export { FailureMessage };
