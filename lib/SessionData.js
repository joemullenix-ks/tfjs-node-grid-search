'use strict';


const TENSOR_FLOW = require('@tensorflow/tfjs');


//TODO: PERF: This object wastes memory, potentially a lot of it. It carries duplicates of the inputs, as both TF tensors and raw arrays.

//			  Also, if the user uses standardization, ... ?

// , in the event it isn't used (i.e. the user does not use standardization. In that case,
//			  we can use the tensors (TF's Tensor.arraySync() reproduces the data in array form).


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
			// no callbacks; useDefaultStandardization will drive the behavior
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
//NOTE: TODO: This format assumption is far too limiting. That's why standardization will be moved into an optional callback.
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

	// walk this set of arrays, finding mean and standard deviation for each feature

	const MEANS = [];
	const STANDARD_DEVIATIONS = [];

	const TOTAL_FEATURES = deepestArray.length;

	console.log('standardizing ' + tensorDimensions + ' dimension tensor with ' + TOTAL_FEATURES + ' features');

	const FEATURE_VALUE_TABLE = [];

	for (let i = 0; i < TOTAL_FEATURES; ++i) {
		FEATURE_VALUE_TABLE.push([]);
	}



//NOTE: TODO: These are basic tensor tools, I'm now realizing. Move them into a lib (or just grab a lib)
//			  ...after you check TF's own utils, or course.
let d_step = 0;

	const WALK_NESTED_ARRAYS = (a) => {
		console.assert(Array.isArray(a));
		console.assert(a.length > 0);

console.log('walk', d_step++);

		a.forEach((value, index, array) => {
console.log('recursed index ' + index);

			if (Array.isArray(value)) {
				WALK_NESTED_ARRAYS(value);
				return;
			}

console.log('tabulate value ' + value + ' at index ' + index);

			console.assert(typeof value === 'number');

			// TABULATE
			FEATURE_VALUE_TABLE[index].push(value);
		});
	};

	// const TABULATE_ARRAY = (a) => {
	// 	a.forEach((value, index, array) => {
	// 		FEATURE_VALUE_TABLE[index].push(value);
	// 	});
	// };

	WALK_NESTED_ARRAYS(inputData);


/*
//TODO: This should probably be done recursively; should be a fun one.
	for (let i = 0; i < inputData.length; ++i) {
		deepestArray = inputData[i];

		while (Array.isArray(deepestArray[0])) {
			deepestArray = deepestArray[0];
		}

//sanity
console.assert(deepestArray.length === TOTAL_FEATURES);




							nope failed; just hits the first index of the 2nd-deepest; do it recursively
							dig until you hit numbers, assert they're the columns, then tally them





		for (let x = 0; x < TOTAL_FEATURES; ++x) {
			console.assert(typeof deepestArray[x] === 'number');

			FEATURE_VALUE_TABLE[i].push(deepestArray[x]);
		}

let pauser = 1;
	}

	for (let i = 0; i < TOTAL_FEATURES; ++i) {
		const FEATURE_MEAN = FindMean(FEATURE_VALUE_TABLE[i]);

		const FEATURE_STDEV = FindStandardDeviation(FEATURE_VALUE_TABLE[i], FEATURE_MEAN);

		MEANS.push(FEATURE_MEAN);

		STANDARD_DEVIATIONS.push(FEATURE_STDEV);
	}
*/


/*KEEP
	// walk this set of arrays as a table, finding mean and standard deviation for each column
	for (let c = 0; c < TOTAL_FEATURES; ++c) {
		const FEATURE_VALUES = [];

		for (let r = 0; r < inputData.length; ++r) {
			FEATURE_VALUES.push(inputData[r][c]);
		}

		const COLUMN_MEAN = FindMean(FEATURE_VALUES);

		MEANS.push(COLUMN_MEAN);

		const COLUMN_STDEV = FindStandardDeviation(FEATURE_VALUES, MEANS[c]);

		STANDARD_DEVIATIONS.push(COLUMN_STDEV);
	}
*/

this also gotta be recursive like; follow the forEach dig above

	// now standardize each value
	for (let i = 0; i < inputData.length; ++i) {
		const CASE = inputData[i];

		for (let x = 0; x < CASE.length; ++x) {
			// shift left by the mean, to 'center' everything on zero
			CASE[x] -= MEANS[x];

			if (STANDARD_DEVIATIONS[x] === 0) {
				// this category (feature) has no deviation; all samples equal the mean
				continue;
			}

			// divide by the standard deviation, so that all categories have a variance of one
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
