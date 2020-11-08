'use strict';


const TENSOR_FLOW = require('@tensorflow/tfjs');


class SessionData {
	constructor(proofPercentage,
				rawInputs,
				rawTargets,
				totalInputNeurons,
				totalOutputNeurons,
				useDefaultStandardization,
				callbackStandardize,
				callbackUnstandardize) {
		console.assert(typeof proofPercentage === 'number');
		console.assert(proofPercentage > 0.0);
		console.assert(proofPercentage < 1.0);
		console.assert(typeof totalInputNeurons === 'number');
		console.assert(totalInputNeurons > 0);
		console.assert(totalInputNeurons === Math.floor(totalInputNeurons));
		console.assert(typeof totalOutputNeurons === 'number');
		console.assert(totalOutputNeurons > 0);
		console.assert(totalOutputNeurons === Math.floor(totalOutputNeurons));

		SessionData.ValidateRawData(rawInputs);
		SessionData.ValidateRawData(rawTargets);

		console.assert(rawInputs.length === rawTargets.length);

		this._totalInputNeurons = totalInputNeurons;
		this._totalOutputNeurons = totalOutputNeurons;

		// create a clone of these inputs pre-standardization, to be used (potentially) for human-friendly reporting

//NOTE: PERF: This object wastes memory, in the event is isn't used (i.e. the user does not use standardization. In that case,
//			  we can use the tensors (TF's Tensor.arraySync() reproduces the data in array form).

		this._rawInputsTraining = JSON.parse(JSON.stringify(rawInputs));

//NOTE: This call validates and sets the callback members, as needed.
		this.SetupStandardization(useDefaultStandardization, callbackStandardize, callbackUnstandardize);

		if (this._callbackStandardize) {
			this._callbackStandardize(rawInputs);
		}
		else if (this._useDefaultStandardization) {
			// standardize (to mean zero, variance one)
			StandardizeInputs(rawInputs);
		}

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

		// we carry a copy of the proof subset in its original, unstandardized form
		this._rawInputsProof = [];

		for (let i = 0; i < PROOF_COUNT; ++i) {
			PROOF_INPUTS.push(rawInputs.shift());
			PROOF_TARGETS.push(rawTargets.shift());

			this._rawInputsProof.push(this._rawInputsTraining.shift());
		}

		// keep this around, for human-friendly reporting
		this._rawTargetsProof = PROOF_TARGETS;

		// convort the proof data to tensors, for the post-training prediction step
		this._proofInputsTensor = TENSOR_FLOW.tidy(() => { return TENSOR_FLOW.tensor(PROOF_INPUTS); });
		this._proofTargetsTensor = TENSOR_FLOW.tidy(() => { return TENSOR_FLOW.tensor(PROOF_TARGETS); });

		// convort the training data to tensors, for the model-fit step
		this._trainingInputsTensor = TENSOR_FLOW.tidy(() => { return TENSOR_FLOW.tensor(rawInputs); });
		this._trainingTargetsTensor = TENSOR_FLOW.tidy(() => { return TENSOR_FLOW.tensor(rawTargets); });
	}

	GetProofInputs() {
		return this._proofInputsTensor;
	}

	GetProofTargets() {
		return this._proofTargetsTensor;
	}

	GetRawProofInputs() {
		return this._rawInputsProof;
	}

	GetRawProofTargets() {
		return this._rawTargetsProof;
	}

	GetRawTrainingInputs() {
		return this._rawInputsTraining;
	}

	GetTotalInputNeurons() {
		return this._totalInputNeurons;
	}

	GetTotalOutputNeurons() {
		return this._totalOutputNeurons;
	}

	GetTrainingInputs() {
		return this._trainingInputsTensor;
	}

	GetTrainingTargets() {
		return this._trainingTargetsTensor;
	}

	SetupStandardization(useDefaultStandardization, callbackStandardize, callbackUnstandardize) {
		console.assert(typeof useDefaultStandardization === 'boolean');

		this._useDefaultStandardization = useDefaultStandardization;

		const STANDARDIZE_CALLBACK_RECEIVED = callbackStandardize !== null && callbackStandardize !== undefined;
		const UNSTANDARDIZE_CALLBACK_RECEIVED = callbackUnstandardize !== null && callbackUnstandardize !== undefined;

		if (STANDARDIZE_CALLBACK_RECEIVED !== UNSTANDARDIZE_CALLBACK_RECEIVED) {
			throw new Error('Invalid standardization callbacks; must supply both (standardize and unstandardize) or neither.');
		}

		if (!STANDARDIZE_CALLBACK_RECEIVED) {
			return;
		}

		console.assert(typeof callbackStandardize === 'function');
		console.assert(typeof callbackUnstandardize === 'function');

		// if the arguments indicate both standardization techniques (stock and custom), we default to custom
		if (this._useDefaultStandardization) {
			console.warn('Standardization callbacks supplied, so default standardization will be ignored.');

			this._useDefaultStandardization = false;
		}

		this._callbackStandardize = callbackStandardize;
		this._callbackUnstandardize = callbackUnstandardize;
	}
}


SessionData.ValidateRawData = (raw) => {
	console.assert(Array.isArray(raw)); // the top level must be an array; this check prevents a lone Number from passing

	let recursionKillswitch = false;

	const CHECK_ARRAYS_OF_NUMBERS_RECURSIVELY = (a) => {
		if (recursionKillswitch) {
			// this raw data has already failed
			return false;
		}

		if (typeof a === 'number') {
			return true; // PASS as Number
		}

		if (Array.isArray(a)) {
			if (a.length > 0) {
				for (let i = 0; i < a.length; ++i) {
					if (CHECK_ARRAYS_OF_NUMBERS_RECURSIVELY(a[i])) {
						continue;
					}

					console.warn('bad nested value', a[i]);

					recursionKillswitch = true;
					return false;
				}

				return true; // PASS as Array
			}

			console.warn('bad empty array', a);

			recursionKillswitch = true;
			return false;
		}

		console.warn('bad type (requires number or array)', (typeof a));

		recursionKillswitch = true;
		return false;
	};

	if (CHECK_ARRAYS_OF_NUMBERS_RECURSIVELY(raw)) {
		return;
	}

	throw new Error('Invalid raw data. Inputs and targets must be supplied as arrays of numbers, flat or nested.');
};


//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

//TODO: This standardization code moves into a separate lib, and/or gets replaced by simple-statistics(tm).
function FindMean(data) {
	let sum = 0;

	for (let i = 0; i < data.length; ++i) {
		sum += data[i];
	}

	const MEAN = sum / data.length;

	return MEAN;
}

function FindStandardDeviation(data, mean) {
	// for each sample, subtract the mean and square the result
	const SQUARED_MEAN_DELTAS = data.map((x) => {return Math.pow(x - mean, 2);});

	const MEAN_OF_ALL_THAT = FindMean(SQUARED_MEAN_DELTAS);

	const STDEV = Math.sqrt(MEAN_OF_ALL_THAT);

	return STDEV;
}

function StandardizeInputs(inputData) {
//NOTE: TODO: This format assumption is far too limiting. That's why standardization will moved into an optional callback.
	console.assert(Array.isArray(inputData));
	console.assert(inputData.length > 0);
	console.assert(Array.isArray(inputData[0]));
	console.assert(inputData[0].length > 0);

	const MEANS = [];

	const STANDARD_DEVIATIONS = [];

	const TABLE_WIDTH = inputData[0].length;

	// walk this set of arrays as a table, finding mean and standard deviation for each column
	for (let c = 0; c < TABLE_WIDTH; ++c) {
		const COLUMN_VALUES = [];

		for (let r = 0; r < inputData.length; ++r) {
			COLUMN_VALUES.push(inputData[r][c]);
		}

		const COLUMN_MEAN = FindMean(COLUMN_VALUES);

		MEANS.push(COLUMN_MEAN);

		const COLUMN_STDEV = FindStandardDeviation(COLUMN_VALUES, MEANS[c]);

		STANDARD_DEVIATIONS.push(COLUMN_STDEV);
	}

	// now standardize each value
	for (let i = 0; i < inputData.length; ++i) {
		const CASE = inputData[i];

		for (let x = 0; x < CASE.length; ++x) {
			// shift left by the mean, to 'center' everything on zero
			CASE[x] -= MEANS[x];

			if (STANDARD_DEVIATIONS[x] === 0) {
				// this category ('feature'?) has no deviation; all samples equal the mean
				continue;
			}

			// divide by the standard deviation, so that all categories a variance of one
			CASE[x] /= STANDARD_DEVIATIONS[x];
		}
	}
}

function UnstandardizeInputs(inputData) {
//NOTE: TODO: This format assumption is far too limiting. That's why standardization will moved into an optional callback.
	console.assert(Array.isArray(inputData));
	console.assert(inputData.length > 0);
	console.assert(Array.isArray(inputData[0]));
	console.assert(inputData[0].length > 0);

	for (let i = 0; i < inputData.length; ++i) {
		const CASE = inputData[i];

		// sanity check these
		CASE.forEach((element, b, c) => {
			console.assert(Math.abs(element - PROOF_INPUTS[i][b]) < 0.001); // epsilon
		});

		for (let x = 0; x < CASE.length; ++x) {
			if (STANDARDIZATION_PARAMS[x].stdev !== 0) {
				CASE[x] *= STANDARDIZATION_PARAMS[x].stdev;
			}

			CASE[x] += STANDARDIZATION_PARAMS[x].mean;
		}
	}

	return inputData;
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


Object.freeze(SessionData);

exports.SessionData = SessionData;
