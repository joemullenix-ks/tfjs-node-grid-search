'use strict';


class SessionData {
	constructor(inputs, targets) {
		console.assert(Array.isArray(inputs));
		console.assert(Array.isArray(targets));
		console.assert(inputs.length > 0);
		console.assert(inputs.length === targets.length);

thinking these should require tensors; no sense in our trying to parse out the depth and shape

		this._inputs = inputs;
		this._targets = targets;
	}

	CalculateInputNeurons() {
		return this._inputs[0].length;
	}

	CalculateOutputNeurons() {
		return this._targets[0].length;
	}
}


Object.freeze(SessionData);

exports.SessionData = SessionData;
