'use strict';


const TENSOR_FLOW = require('@tensorflow/tfjs');


class SessionData {
	constructor(proofPercentage, rawInputs, rawTargets, totalInputNeurons, totalOutputNeurons) {
		console.assert(typeof proofPercentage === 'number');
		console.assert(proofPercentage > 0.0);
		console.assert(proofPercentage < 1.0);
		console.assert(Array.isArray(rawInputs));
		console.assert(Array.isArray(rawTargets));
		console.assert(rawInputs.length > 0);
		console.assert(rawInputs.length === rawTargets.length);
		console.assert(typeof totalInputNeurons === 'number');
		console.assert(totalInputNeurons > 0);
		console.assert(totalInputNeurons === Math.floor(totalInputNeurons));
		console.assert(typeof totalOutputNeurons === 'number');
		console.assert(totalOutputNeurons > 0);
		console.assert(totalOutputNeurons === Math.floor(totalOutputNeurons));

		this._totalInputNeurons = totalInputNeurons;
		this._totalOutputNeurons = totalOutputNeurons;

		// move a portion of the cases into a 'proof' set, to be used after training to measure generalization

		const TOTAL_CASES = rawInputs.length;

		const PROOF_COUNT = Math.round(TOTAL_CASES * proofPercentage);

		if (PROOF_COUNT <= 0) {
			throw new Error('The provided proofPercentage is too low. Zero cases moved from the training set.');
		}

		if (PROOF_COUNT >= TOTAL_CASES) {
			throw new Error('The provided proofPercentage is too high. 100% of cases moved from the training set.');
		}

		const PROOF_INPUTS = [];
		const PROOF_TARGETS = [];

		for (let i = 0; i < PROOF_COUNT; ++i) {
			PROOF_INPUTS.push(rawInputs.shift());
			PROOF_TARGETS.push(rawTargets.shift());
		}

		// move a portion of the cases into a 'proof' set, to be used after training to measure generalization
		this._proofInputsTensor = TENSOR_FLOW.tidy(() => { return TENSOR_FLOW.tensor(PROOF_INPUTS); });
		this._proofTargetsTensor = TENSOR_FLOW.tidy(() => { return TENSOR_FLOW.tensor(PROOF_TARGETS); });

		// move a portion of the cases into a 'proof' set, to be used after training to measure generalization
		this._trainingInputsTensor = TENSOR_FLOW.tidy(() => { return TENSOR_FLOW.tensor(rawInputs); });
		this._trainingTargetsTensor = TENSOR_FLOW.tidy(() => { return TENSOR_FLOW.tensor(rawTargets); });
	}

	GetTotalInputNeurons() {
		// return this._inputs[0].length;
		return this._totalInputNeurons;
	}

	GetTotalOutputNeurons() {
		// return this._targets[0].length;
		return this._totalOutputNeurons;
	}
}


Object.freeze(SessionData);

exports.SessionData = SessionData;
