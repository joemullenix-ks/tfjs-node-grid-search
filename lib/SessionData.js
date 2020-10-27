'use strict';


class SessionData {
	constructor(inputs, targets) {
		console.assert(Array.isArray(inputs));
		console.assert(Array.isArray(targets));
		console.assert(inputs.length > 0);
		console.assert(inputs.length === targets.length);

		this._inputs = inputs;
		this._targets = targets;
	}
}


Object.freeze(SessionData);

exports.SessionData = SessionData;
