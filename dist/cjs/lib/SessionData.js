'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionData = void 0;
const TENSOR_FLOW = __importStar(require("@tensorflow/tfjs-node"));
//TODO: PERF: This object wastes memory, potentially a lot of it. It carries duplicates of the inputs, as both TF tensors
//			  and raw arrays.
//			  In some usage cases the array versions aren't required (e.g. the user does not use standardization). Further,
//			  even if the arrays _are_ required, we don't need to store them here. We can use TF's Tensor.arraySync() to
//			  reproduces the data in array form, saving memory at the cost of a CPU hit.
//			  Convert this to an abstract base, and setup concrete versions specific to the desired usage pattern:
//				SessionData
//				> SessionDataStandardized
//				> SessionDataStandardizedFaster
//				> SessionDataStandardizedSmaller
class SessionData {
    constructor(proofPercentage, rawInputs, rawTargets, _useDefaultStandardization, _callbackStandardize, _callbackUnstandardize) {
        this._useDefaultStandardization = _useDefaultStandardization;
        this._callbackStandardize = _callbackStandardize;
        this._callbackUnstandardize = _callbackUnstandardize;
        this._totalInputNeurons = 0;
        this._totalOutputNeurons = 0;
        this._totalTrainingCases = 0;
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
        this.SetupStandardization();
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
        console.log('total cases: ' + TOTAL_CASES + ', with ' + PROOF_COUNT + ' reserved for generalization tests');
        if (PROOF_COUNT < 1) {
            throw new Error('The provided proofPercentage is too low. Zero cases moved from the training set.');
        }
        if (PROOF_COUNT >= TOTAL_CASES) {
            throw new Error('The provided proofPercentage is too high. 100% of cases moved from the training set.');
        }
        //NOTE: "unknown" feels like a copout, but there is no other (even remotely clean) way to inform the upcoming
        //		array shift/push calls. This would have to be initialized to the depth of the user input, which is
        //		unknown (ha!) at compile time. I could measure it outsie, and create a generic class/interface of some
        //		kind (in lieu of six differnet support objects (at least), and gobs of duplication).
        //TODO: (low-pri, but good exercise) Look into a generic class, e.g. DeepTrainingData::Array<T>.
        const PROOF_INPUTS = [];
        const PROOF_TARGETS = [];
        // we also carry a copy of the proof subset, in its original, unstandardized form
        //NOTE: Cases are migrated from _rawInputsTraining, so that afterward the standardized and raw collections
        //		match, i.e. both of these are true:
        //			PROOF_INPUTS.length === _rawInputsProof.length
        //			rawInputs.length === _rawInputsTraining.length
        this._rawInputsProof = [];
        for (let i = 0; i < PROOF_COUNT; ++i) {
            if (rawInputs.length === 0) {
                throw new Error('Inputs array emptied prematurely');
            }
            if (rawTargets.length === 0) {
                throw new Error('Targets array emptied prematurely');
            }
            //NOTE: This assign-first-then-shift approach is not ideal, and it's only done as a workaround to the conversion
            //		problems I had w/ TFNestedArray; possibly alleviated by the Array<unknown> change, but that's also
            //		an unacceptable solution, long term.
            PROOF_INPUTS[i] = rawInputs[0];
            PROOF_TARGETS[i] = rawTargets[0];
            rawInputs.shift();
            rawTargets.shift();
            this._rawInputsProof[i] = this._rawInputsTraining[0];
            this._rawInputsTraining.shift();
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
    get proofInputsTensor() { return this._proofInputsTensor; }
    get proofTargets() { return this._proofTargets; }
    get rawInputsProof() { return this._rawInputsProof; }
    get totalInputNeurons() { return this._totalInputNeurons; }
    get totalOutputNeurons() { return this._totalOutputNeurons; }
    get totalTrainingCases() { return this._totalTrainingCases; }
    get trainingInputsTensor() { return this._trainingInputsTensor; }
    get trainingTargetsTensor() { return this._trainingTargetsTensor; }
    SetupStandardization() {
        if (!this._callbackStandardize) {
            if (!this._callbackUnstandardize) {
                // no callbacks; useDefaultStandardization will drive the behavior
                return;
            }
            throw new Error('Invalid standardization callbacks; received "callbackUnstandardize" but not "callbackStandardize".');
        }
        // if the arguments indicate both standardization techniques (stock and custom), we use custom, i.e. the user's callback(s)
        if (this._useDefaultStandardization) {
            console.warn('Standardization callbacks supplied, so default standardization will be ignored.');
            this._useDefaultStandardization = false;
        }
    }
    static ValidateRawData(raw) {
        //NOTE: The top level of 'raw' must be an array, otherwise a lone Number would pass validation. This is no longer
        //		a problem under TypeScript, but it's worth keeping in mind.
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
    }
}
exports.SessionData = SessionData;
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//TODO: This standardization code moves into a separate lib, and/or gets replaced by simple-statistics(tm).
//		It also has a few generic tensor tools; unsure whether TF or simple-statistics has either, but probably.
function CountLeafElements(inputData) {
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
    console.assert(data.length > 0);
    let sum = 0;
    for (let i = 0; i < data.length; ++i) {
        sum += data[i];
    }
    const MEAN = sum / data.length;
    return MEAN;
}
function FindStandardDeviation(data, mean) {
    // for each sample, subtract the mean and square the result
    const SQUARED_MEAN_DELTAS = data.map((x) => { return Math.pow(x - mean, 2); });
    const MEAN_OF_ALL_THAT = FindMean(SQUARED_MEAN_DELTAS);
    const STDEV = Math.sqrt(MEAN_OF_ALL_THAT);
    return STDEV;
}
function StandardizeInputs(inputData) {
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
    console.log('Standardizing ' + tensorDimensions + ' dimension tensor with ' + TOTAL_FEATURES + ' features.');
    const FEATURE_VALUE_TABLE = [];
    for (let i = 0; i < TOTAL_FEATURES; ++i) {
        FEATURE_VALUE_TABLE.push([]);
    }
    // walk this set of (potentially nested) arrays, tabulating the feature values at the bottom
    //NOTE: TODO: This is actually a basic tensor tool, I'm now realizing. Find a good tensor lib, or start one.
    //			  ...after you check TF's own utils, or course!
    const RECURSIVELY_TABULATE_FEATURES = (a) => {
        console.assert(a.length > 0);
        a.forEach((value, index) => {
            if (Array.isArray(value)) {
                RECURSIVELY_TABULATE_FEATURES(value);
                return;
            }
            if (typeof value !== 'number') {
                throw new Error('Invalid type found while tabulating features ' + (typeof value));
            }
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
        console.assert(a.length > 0);
        // a.forEach((value: TFNestedArray | number, index: number, array: TFNestedArray) => {
        a.forEach((value, index, array) => {
            if (Array.isArray(value)) {
                RECURSIVELY_STANDARDIZE_FEATURES(value);
                return;
            }
            if (typeof value !== 'number') {
                throw new Error('Invalid type found during default standardization ' + (typeof value));
            }
            // we've hit a 'bottom' level array (a leaf node)
            //NOTE: We use this unnecessary, temporary 'sample' as an extra register. This is purely done because TypeScript
            //		does not like my TFInputsArray type. That type was written to handle nested arrays, but it's causing other
            //		problems, primarily within this file.
            //
            //TODO: This can be 'solved' with this cast: "const NUMBER_ARRAY = array as Array<number>;", but that seems as
            //		ugly as this, if not uglier. I need further investigation of map/reduce/filter/forEach/etc in TS.
            let sample = Number(array[index]);
            // shift left by the mean, to 'center' everything on zero
            sample -= MEANS[index];
            if (STANDARD_DEVIATIONS[index] === 0) {
                // this category (feature) has no deviation; all samples equal the mean
                // set the value back into its slot
                array[index] = sample;
                return;
            }
            // divide by the standard deviation, so that all categories have a variance of one
            sample /= STANDARD_DEVIATIONS[index];
            // set the value back into its slot
            array[index] = sample;
            /*KEEP: ...until the above TS issue is resolved. This is the original, and there's nothing wrong with it.
                        // shift left by the mean, to 'center' everything on zero
                        array[index] -= MEANS[index];
            
                        if (STANDARD_DEVIATIONS[index] === 0) {
                            // this category (feature) has no deviation; all samples equal the mean
                            return;
                        }
            
                        // divide by the standard deviation, so that all categories have a variance of one
                        array[index] /= STANDARD_DEVIATIONS[index];
            */
        });
    };
    RECURSIVELY_STANDARDIZE_FEATURES(inputData);
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Object.freeze(SessionData);
//# sourceMappingURL=SessionData.js.map