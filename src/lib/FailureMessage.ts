'use strict';


/**
 * Simple class for retrieving details/info/instructions from a failed check.
 */
class FailureMessage {
	private _text = '';

	/**
	* Creates an instance of FailureMessage.
	*/
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
