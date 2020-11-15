'use strict';


const TENSOR_FLOW = require('@tensorflow/tfjs');


//TODO: PERF: This object wastes memory, potentially a lot of it. It carries duplicates of the inputs, as both TF tensors
//			  and raw arrays.
//			  In some usage cases the array versions aren't required (i.e. the user does not use standardization). Further,
//			  even if the arrays _are_ required, we don't need to store them here. We can use TF's Tensor.arraySync() to
//			  reproduces the data in array form, at the cost of a CPU hit (which could be significant).
//			  Convert this to an abstract base, and setup concrete versions specific to the desired usage pattern:
//				SessionData
//				> SessionDataStandardized
//				> SessionDataStandardizedFaster
//				> SessionDataStandardizedSmaller


class SessionData {
	constructor(proofPercentage,
				rawInputs,
				rawTargets,
				useDefaultStandardization,
				callbackStandardize,
				callbackUnstandardize) {
		console.assert(typeof proofPercentage === 'number');
		console.assert(proofPercentage > 0.0);
		console.assert(proofPercentage < 1.0);

		SessionData.ValidateRawData(rawInputs);
		SessionData.ValidateRawData(rawTargets);

		if (rawInputs.length !== rawTargets.length) {
			throw new Error('Session data invalid. The number of inputs (' + rawInputs.length + ') does not match the '
							+ 'number of targets (' + rawTargets.length + ') .');
		}

		this._totalInputNeurons = CountLeafElements(rawInputs);
		this._totalOutputNeurons = CountLeafElements(rawTargets);

		console.log('input neurons: ' + this._totalInputNeurons);
		console.log('output neurons: ' + this._totalOutputNeurons);

		// create a clone of these inputs pre-standardization, to be used (potentially) for human-friendly reporting
		this._rawInputsTraining = JSON.parse(JSON.stringify(rawInputs));

//NOTE: This call validates and sets the callback members, as needed.
		this.SetupStandardization(useDefaultStandardization, callbackStandardize, callbackUnstandardize);

//NOTE: TODO: We don't standardize targets, yet, although that will be desired for regression networks. When we make that
//			  change, support it with a default and optional callbacks.

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

		console.log('total cases: ' + TOTAL_CASES);
		console.log('reserved for generalization tests: ' + PROOF_COUNT);

		if (PROOF_COUNT < 1) {
			throw new Error('The provided proofPercentage is too low. Zero cases moved from the training set.');
		}

		if (PROOF_COUNT >= TOTAL_CASES) {
			throw new Error('The provided proofPercentage is too high. 100% of cases moved from the training set.');
		}

		const PROOF_INPUTS = [];
		const PROOF_TARGETS = [];

		// we also carry a copy of the proof subset, in its original, unstandardized form

//NOTE: These will be moved from _rawInputsTraining, so that afterward the standardized and raw collections match,
//		(e.g. PROOF_INPUTS.length === _rawInputsProof.length and rawInputs.length === _rawInputsTraining.length).
		this._rawInputsProof = [];

		for (let i = 0; i < PROOF_COUNT; ++i) {
			PROOF_INPUTS.push(rawInputs.shift());
			PROOF_TARGETS.push(rawTargets.shift());

			this._rawInputsProof.push(this._rawInputsTraining.shift());
		}

		// store the targets of the cases we separated from the training set
		this._proofTargets = PROOF_TARGETS;

		// convert the proof data to tensors, for the post-training prediction step
		this._proofInputsTensor = TENSOR_FLOW.tidy(() => { return TENSOR_FLOW.tensor(PROOF_INPUTS); });
		this._proofTargetsTensor = TENSOR_FLOW.tidy(() => { return TENSOR_FLOW.tensor(PROOF_TARGETS); });

		// convert the training data to tensors, for the model-fit step
		this._trainingInputsTensor = TENSOR_FLOW.tidy(() => { return TENSOR_FLOW.tensor(rawInputs); });
		this._trainingTargetsTensor = TENSOR_FLOW.tidy(() => { return TENSOR_FLOW.tensor(rawTargets); });

		this._totalTrainingCases = rawInputs.length;
	}

	get totalTrainingCases() { return this._totalTrainingCases; }

//TODO: Accessorize these next (vv)
	GetProofInputsTensor() {
		return this._proofInputsTensor;
	}

	GetProofTargets() {
		return this._proofTargets;
	}

	GetProofTargetsTensor() {
		return this._proofTargetsTensor;
	}

	GetRawProofInputs() {
		return this._rawInputsProof;
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

		if (!STANDARDIZE_CALLBACK_RECEIVED) {
			if (!UNSTANDARDIZE_CALLBACK_RECEIVED) {
				// no callbacks; useDefaultStandardization will drive the behavior
				return;
			}

			throw new Error('Invalid standardization callbacks; received "callbackUnstandardize" but not "callbackUnstandardize".');
		}

		console.assert(typeof callbackStandardize === 'function');

		// if the arguments indicate both standardization techniques (stock and custom), we use custom; the user's callback(s)
		if (this._useDefaultStandardization) {
			console.warn('Standardization callbacks supplied, so default standardization will be ignored.');

			this._useDefaultStandardization = false;
		}

		this._callbackStandardize = callbackStandardize;

		if (!UNSTANDARDIZE_CALLBACK_RECEIVED) {
			return;
		}

		console.assert(typeof callbackUnstandardize === 'function');

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
//		It also has a few generic tensor tools; unsure whether TF or simple-statistics has either, but probably.
function CountLeafElements(inputData) {
	console.assert(Array.isArray(inputData));
	console.assert(inputData.length > 0);

	// find the lowest level of these (potentially) nested arrays
	let deepestArray = inputData;

	while (Array.isArray(deepestArray[0])) {
		console.assert(deepestArray.length > 0);

		deepestArray = deepestArray[0];
	}

	return deepestArray.length;
}

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
	console.assert(Array.isArray(inputData));
	console.assert(inputData.length > 0);

	// find the lowest level of these (potentially) nested arrays
	let deepestArray = inputData;

	let tensorDimensions = 1;

	while (Array.isArray(deepestArray[0])) {
		console.assert(deepestArray.length > 0);

		deepestArray = deepestArray[0];

		++tensorDimensions;
	}

	// prepare a table for every feature value

	const TOTAL_FEATURES = deepestArray.length;

	console.log('standardizing ' + tensorDimensions + ' dimension tensor with ' + TOTAL_FEATURES + ' features');

	const FEATURE_VALUE_TABLE = [];

	for (let i = 0; i < TOTAL_FEATURES; ++i) {
		FEATURE_VALUE_TABLE.push([]);
	}

	// walk this set of (potentially nested) arrays, tabulating the feature values at the bottom

//NOTE: TODO: This is actually a basic tensor tool, I'm now realizing. Find a good tensor lib, or start one.
//			  ...after you check TF's own utils, or course!
	const RECURSIVELY_TABULATE_FEATURES = (a) => {
		console.assert(Array.isArray(a));
		console.assert(a.length > 0);

		a.forEach((value, index) => {
			if (Array.isArray(value)) {
				RECURSIVELY_TABULATE_FEATURES(value);
				return;
			}

			console.assert(typeof value === 'number');

			// we've hit a 'bottom' level array (a leaf node); tabulate its feature values
			FEATURE_VALUE_TABLE[index].push(value);
		});
	};

	RECURSIVELY_TABULATE_FEATURES(inputData);

	// find mean and standard deviation for each feature

	const MEANS = [];

	const STANDARD_DEVIATIONS = [];

	for (let i = 0; i < TOTAL_FEATURES; ++i) {
		const FEATURE_MEAN = FindMean(FEATURE_VALUE_TABLE[i]);

		const FEATURE_STDEV = FindStandardDeviation(FEATURE_VALUE_TABLE[i], FEATURE_MEAN);

		MEANS.push(FEATURE_MEAN);

		STANDARD_DEVIATIONS.push(FEATURE_STDEV);
	}

	// walk this set of (potentially) nested arrays, adjusting each feature set to mean zero and variance one

	const RECURSIVELY_STANDARDIZE_FEATURES = (a) => {
		console.assert(Array.isArray(a));
		console.assert(a.length > 0);

		a.forEach((value, index, array) => {
			if (Array.isArray(value)) {
				RECURSIVELY_STANDARDIZE_FEATURES(value);
				return;
			}

			console.assert(typeof value === 'number');

			// we've hit a 'bottom' level array (a leaf node)

			// shift left by the mean, to 'center' everything on zero
			array[index] -= MEANS[index];

			if (STANDARD_DEVIATIONS[index] === 0) {
				// this category (feature) has no deviation; all samples equal the mean
				return;
			}

			// divide by the standard deviation, so that all categories have a variance of one
			array[index] /= STANDARD_DEVIATIONS[index];
		});
	};

	RECURSIVELY_STANDARDIZE_FEATURES(inputData);
}

function UnstandardizeInputs(inputData) {
throw new Error('KEEP: but this needs an update before it can be used; see the recursive digs in StandardizeInputs()')

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
