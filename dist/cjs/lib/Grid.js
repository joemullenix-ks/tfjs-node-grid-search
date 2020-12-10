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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
//NOTE: This variant of the lib (tfjs-node) is not yet part of a proper release (as of 2.7.0)!
//		See https://github.com/tensorflow/tfjs/issues/4052 for the issue and a _workaround_ (not a proper
//		solution yet), which involves manually copying this file:
//
//			copy tensorflow.dll
//			from: node_modules\@tensorflow\tfjs-node\deps\lib
//			  to: node_modules\@tensorflow\tfjs-node\lib\napi-v6
const TENSOR_FLOW = __importStar(require("@tensorflow/tfjs-node"));
const Axis = __importStar(require("./Axis"));
const AxisSetTraverser_1 = require("./AxisSetTraverser");
const EpochStats_1 = require("./EpochStats");
const FileIO_1 = require("./FileIO");
const GridOptions_1 = require("./GridOptions");
const GridRunStats_1 = require("./GridRunStats");
const IterationResult_1 = require("./IterationResult");
const ModelParams_1 = require("./ModelParams");
const ModelTestStats_1 = require("./ModelTestStats");
const Utils_1 = require("./Utils");
class Grid {
    constructor(axisSet, _modelStatics, _sessionData, _callbackEvaluatePrediction, _userGridOptions, _callbackReportIteration, _callbackReportEpoch, _callbackReportBatch) {
        this._modelStatics = _modelStatics;
        this._sessionData = _sessionData;
        this._callbackEvaluatePrediction = _callbackEvaluatePrediction;
        this._userGridOptions = _userGridOptions;
        this._callbackReportIteration = _callbackReportIteration;
        this._callbackReportEpoch = _callbackReportEpoch;
        this._callbackReportBatch = _callbackReportBatch;
        this._timeStartBatch = 0;
        this._timeStartEpoch = 0;
        this._timeStartGrid = 0;
        this._timeStartIteration = 0;
        console.log('\n' + 'Instantiating Grid...');
        // take the user's options block, if supplied, otherwise setup defaults
        if (!this._userGridOptions) {
            this._gridOptions = new GridOptions_1.GridOptions();
        }
        else {
            this._gridOptions = this._userGridOptions;
        }
        this._axisSetTraverser = new AxisSetTraverser_1.AxisSetTraverser(axisSet);
        // prune (and warn about) any model params that are pre-empted by a dynamic axis
        this.ResolveModelDefinition();
    }
    CreateModel(modelParams) {
        const TOTAL_INPUT_NEURONS = this._sessionData.totalInputNeurons;
        const TOTAL_OUTPUT_NEURONS = this._sessionData.totalOutputNeurons;
        const TOTAL_HIDDEN_LAYERS = modelParams.GetNumericParam(Axis.AxisNames.LAYERS);
        const TF_MODEL = TENSOR_FLOW.sequential();
        if (TOTAL_HIDDEN_LAYERS === 0) {
            // this network goes directly from input to output, e.g. single layer perceptron
            TF_MODEL.add(TENSOR_FLOW.layers.dense({
                inputShape: [TOTAL_INPUT_NEURONS],
                units: TOTAL_OUTPUT_NEURONS,
                activation: modelParams.GetTextParam('activationOutput'),
                useBias: true,
                kernelInitializer: this._modelStatics.GenerateInitializerKernel(),
                biasInitializer: this._modelStatics.GenerateInitializerBias()
            }));
        }
        else {
            // add the first hidden layer, which takes the inputs (TF has no discrete 'input layer')
            TF_MODEL.add(TENSOR_FLOW.layers.dense({
                inputShape: [TOTAL_INPUT_NEURONS],
                units: modelParams.GetNumericParam(Axis.AxisNames.NEURONS),
                activation: modelParams.GetTextParam('activationInput'),
                useBias: true,
                kernelInitializer: this._modelStatics.GenerateInitializerKernel(),
                biasInitializer: this._modelStatics.GenerateInitializerBias()
            }));
            // add the remaining hidden layers; one-based, because of the built-in input layer
            for (let i = 1; i < TOTAL_HIDDEN_LAYERS; ++i) {
                TF_MODEL.add(TENSOR_FLOW.layers.dense({
                    units: modelParams.GetNumericParam(Axis.AxisNames.NEURONS),
                    activation: modelParams.GetTextParam('activationHidden'),
                    useBias: true,
                    kernelInitializer: this._modelStatics.GenerateInitializerKernel(),
                    biasInitializer: this._modelStatics.GenerateInitializerBias()
                }));
            }
            TF_MODEL.add(TENSOR_FLOW.layers.dense({
                units: TOTAL_OUTPUT_NEURONS,
                activation: modelParams.GetTextParam('activationOutput'),
                useBias: true,
                biasInitializer: this._modelStatics.GenerateInitializerBias()
            }));
        }
        //TODO: Print these, but only under a verbocity setting (way too spammy)
        //		TF_MODEL.summary();
        const LEARNING_RATE = modelParams.GetNumericParam(Axis.AxisNames.LEARN_RATE);
        // compile the model, which prepares it for training
        TF_MODEL.compile({
            optimizer: this._modelStatics.GenerateOptimizer(LEARNING_RATE),
            loss: this._modelStatics.GenerateLossFunction(),
            metrics: 'accuracy'
        });
        return TF_MODEL;
    }
    ResetEpochStats() {
        console.assert(this._gridOptions.GetOption('epochStatsDepth') !== undefined);
        //NOTE: This is currently only used by the reporting callback. It's contents, however, will be critical to tracking
        //		overfit and stuck situations, as well as things like Smart Start(tm) (restarting unlucky iterations).
        const EPOCH_STATS_DEPTH = Number(this._gridOptions.GetOption('epochStatsDepth'));
        this._epochStats = new EpochStats_1.EpochStats(EPOCH_STATS_DEPTH);
    }
    Run() {
        return __awaiter(this, void 0, void 0, function* () {
            const GRID_RUN_STATS = new GridRunStats_1.GridRunStats();
            const TOTAL_ITERATIONS = this._axisSetTraverser.totalIterations;
            const TOTAL_REPETITIONS = Number(this._gridOptions.GetOption('repetitions'));
            const TOTAL_PASSES = TOTAL_ITERATIONS * TOTAL_REPETITIONS;
            let pass = 0;
            this._timeStartGrid = Date.now();
            for (let i = 0; !this._axisSetTraverser.traversed; ++i) {
                const DYNAMIC_PARAMS = this._axisSetTraverser.CreateIterationParams();
                const STATIC_PARAMS = this._modelStatics.ShallowCloneParams();
                const MODEL_PARAMS = new ModelParams_1.ModelParams(DYNAMIC_PARAMS, STATIC_PARAMS);
                for (let r = 0; r < TOTAL_REPETITIONS; ++r) {
                    console.log('________________________________________________________________');
                    console.log('Pass ' + (1 + pass) + '/' + TOTAL_PASSES
                        + ' (Iteration ' + (1 + i) + '/' + TOTAL_ITERATIONS
                        + ', Repetition ' + (1 + r) + '/' + TOTAL_REPETITIONS + ')'
                        + '\n' + this._axisSetTraverser.WriteReport(false)); // non-compact report
                    ++pass;
                    this._timeStartIteration = Date.now();
                    // reset these, for the first report of the upcoming iteration
                    this._timeStartBatch = this._timeStartIteration;
                    this._timeStartEpoch = this._timeStartIteration;
                    const MODEL = this.CreateModel(MODEL_PARAMS);
                    yield this.TrainModel(MODEL, MODEL_PARAMS);
                    const ITERATION_DURATION = Date.now() - this._timeStartIteration;
                    const MODEL_TEST_STATS = this.TestModel(MODEL, MODEL_PARAMS, ITERATION_DURATION);
                    const ITERATION_RESULT = new IterationResult_1.IterationResult(i, this._axisSetTraverser.LookupIterationDescriptor(i), this._epochStats, MODEL_PARAMS, MODEL_TEST_STATS, r, ITERATION_DURATION);
                    GRID_RUN_STATS.AddIterationResult(ITERATION_RESULT);
                }
                this._axisSetTraverser.Advance();
            }
            const GRID_TIME_END = Date.now();
            const GRID_DURATION = GRID_TIME_END - this._timeStartGrid;
            console.log('\n' + '<< GRID SEARCH COMPLETE >>', '\n', '\n' + 'started @ ' + (new Date(this._timeStartGrid)).toLocaleString(), '\n' + '  ended @ ' + (new Date(GRID_TIME_END)).toLocaleString(), '\n' + 'duration: ' + Utils_1.Utils.WriteDurationReport(GRID_DURATION), '\n');
            console.log('Results (sorted by score)');
            console.log(GRID_RUN_STATS.WriteReport(true));
            const WRITE_RESULTS_OPTION = this._gridOptions.GetOption('writeResultsToDirectory');
            if (typeof WRITE_RESULTS_OPTION === 'string') {
                const FILENAME = FileIO_1.FileIO.ProduceResultsFilename();
                yield FileIO_1.FileIO.WriteResultsFile(FILENAME, WRITE_RESULTS_OPTION, GRID_RUN_STATS.WriteCSV());
                //TODO: Look into Node's os/platform library. Gotta be a way to pull the appropriate slashes.
                //		...and on the same pass, lookup and print the root directory.
                console.log('\n'
                    + 'Results file written as '
                    + (WRITE_RESULTS_OPTION === ''
                        ? './'
                        : WRITE_RESULTS_OPTION + '/')
                    + FILENAME);
            }
        });
    }
    ResolveModelDefinition() {
        //NOTE: TODO: I'm not entirely happy with this. It feels like access breaking, to reach in via callback.
        //			  It would be better to just produce a list of axis keys. That's all we want, anyway.
        //			  ...will leave this on hold, pending the completion of the supported axes. There may be more
        //			  to consider when it comes to complex axes like activator-schedules.
        // ensure the static and dynamic model parameters have no overlap, by stripping any dupes from the statics
        this._axisSetTraverser.ExamineAxisNames((axisKey) => {
            this._modelStatics.AttemptStripParam(axisKey);
        });
    }
    //TODO: This model type might be too strict. Consider the lower-level TF LayersModel.
    TestModel(model, modelParams, duration) {
        console.assert(model.built);
        console.assert(duration >= 0);
        console.log('Testing...');
        //NOTE: This rule (limitation) is for the arraySync() done on PREDICTIONS_TENSOR.
        //		"model.predict()" is dual mode. It outputs an array of Tensors when given an array of Tensors
        //		as input. Our evaluation and scoring logic is not yet ready to support multiple ins/outs.
        //TODO: ...but it will.
        if (!(this._sessionData.proofInputsTensor instanceof TENSOR_FLOW.Tensor)) {
            throw new Error('Invalid proof inputs; multi-input models are not yet supported.');
        }
        // run the unseen data through this trained model
        const PREDICTIONS_TENSOR = model.predict(this._sessionData.proofInputsTensor, {
            batchSize: modelParams.GetNumericParam(Axis.AxisNames.BATCH_SIZE),
            //NOTE: 'verbose' is not implemented as of TF 2.7.0. The documentation is wrong, but it's noted in the lib (see model.ts).
            verbose: false
        });
        // convert this TF Tensor into array form, for human-friendly analysis
        const PREDICTIONS = PREDICTIONS_TENSOR.arraySync();
        // pull the unstandardized proof cases (again, for the human-friendly report)
        const PROOF_INPUTS = this._sessionData.rawInputsProof;
        const PROOF_TARGETS = this._sessionData.proofTargets;
        console.assert(PROOF_TARGETS.length === PREDICTIONS.length); // sanity-check
        if (this._callbackReportIteration) {
            this._callbackReportIteration(duration, PREDICTIONS, PROOF_INPUTS, PROOF_TARGETS);
        }
        // we now 'score' the predictions by tallying the responses from the user's callback
        let aggregateDeltaCorrect = 0.0;
        let aggregateDeltaIncorrect = 0.0;
        let totalCorrect = 0;
        for (let i = 0; i < PREDICTIONS.length; ++i) {
            // send each targets-prediction pair to the user, for their scoring logic
            const EVALUATION = this._callbackEvaluatePrediction(PROOF_TARGETS[i], PREDICTIONS[i]);
            if (EVALUATION.correct) {
                ++totalCorrect;
                aggregateDeltaCorrect += EVALUATION.delta;
            }
            else {
                aggregateDeltaIncorrect += EVALUATION.delta;
            }
        }
        const MODEL_TEST_STATS = new ModelTestStats_1.ModelTestStats(aggregateDeltaCorrect, aggregateDeltaIncorrect, totalCorrect, PREDICTIONS.length);
        console.log('Test complete. Score: ' + (100 * MODEL_TEST_STATS.CalculateScore()).toFixed(3) + '%');
        return MODEL_TEST_STATS;
    }
    //TODO: This model type might be too strict. Consider the lower-level TF LayersModel.
    TrainModel(model, modelParams) {
        return __awaiter(this, void 0, void 0, function* () {
            console.assert(model.built);
            this.ResetEpochStats();
            const TOTAL_CASES = this._sessionData.totalTrainingCases;
            //NOTE: ceil() is how TF performs this same split, as of v2.7.0.
            const TOTAL_VALIDATION_CASES = Math.ceil(TOTAL_CASES * modelParams.GetNumericParam(Axis.AxisNames.VALIDATION_SPLIT));
            const TOTAL_TRAINING_CASES = TOTAL_CASES - TOTAL_VALIDATION_CASES;
            //NOTE: Cast this one. We know it exists, because we backfill any missing params. (TODO: Rewrite GridOptions vis-a-vis TS.)
            const USER_VALIDATION_SET_SIZE_MIN = this._gridOptions.GetOption('validationSetSizeMin');
            if (TOTAL_VALIDATION_CASES <= USER_VALIDATION_SET_SIZE_MIN) {
                console.warn('Validation split is extremely low, and may not produce useful results.');
            }
            if (TOTAL_TRAINING_CASES <= USER_VALIDATION_SET_SIZE_MIN) {
                console.warn('Validation split is extremely high, and may not produce useful results.');
            }
            const TOTAL_EPOCHS = modelParams.GetNumericParam(Axis.AxisNames.EPOCHS);
            console.log('Training with ' + TOTAL_CASES + ' cases ('
                + TOTAL_TRAINING_CASES + ' train, '
                + TOTAL_VALIDATION_CASES + ' validate) '
                + 'for ' + TOTAL_EPOCHS + ' epochs...');
            yield model.fit(this._sessionData.trainingInputsTensor, this._sessionData.trainingTargetsTensor, {
                batchSize: modelParams.GetNumericParam(Axis.AxisNames.BATCH_SIZE),
                epochs: TOTAL_EPOCHS,
                shuffle: true,
                //NOTE: As of 2020 11 23, tfjs-node logs an extra line per-epoch w/ verbosity 1+. It's redundant with our
                //		default per-epoch line, thus the "0". However, it's worth keeping an eye on this for debugging.
                verbose: 0,
                //NOTE: Validation is only performed if we provide this "validationSplit" arg. It's necessary to track overfit and stuck.
                validationSplit: modelParams.GetNumericParam(Axis.AxisNames.VALIDATION_SPLIT),
                callbacks: {
                    //NOTE: These events are available, as of TF 2.7.0:
                    // 								onTrainBegin: (logs) => { console.log('onTrainBegin', logs); },
                    // 								onTrainEnd: (logs) => { console.log('onTrainEnd', logs); },
                    // 								onEpochBegin: (epoch, logs) => { console.log('onEpochBegin', epoch, logs); },
                    // 								onEpochEnd: (epoch, logs) => { console.log('onEpochEnd', epoch, logs); },
                    // 								onBatchBegin: (batch, logs) => { console.log('onBatchBegin', batch, logs); },
                    // 								onBatchEnd: (batch, logs) => { console.log('onBatchEnd', batch, logs); },
                    // 								onYield: (epoch, batch, logs) => { console.log('onYield', epoch, batch, logs); }
                    onBatchEnd: (batch, logs) => {
                        if (!this._callbackReportBatch) {
                            return;
                        }
                        //TODO: This is essentially duped by the Epoch handler (just below).
                        const TIME_NOW = Date.now();
                        const DURATION_BATCH = TIME_NOW - this._timeStartBatch;
                        this._timeStartBatch = TIME_NOW;
                        this._callbackReportBatch(DURATION_BATCH, batch, logs);
                    },
                    onEpochEnd: (epoch, logs) => {
                        this._epochStats.Update(epoch, logs);
                        //TODO: This is essentially duped by the Batch handler (just above).
                        const TIME_NOW = Date.now();
                        const DURATION_EPOCH = TIME_NOW - this._timeStartEpoch;
                        this._timeStartEpoch = TIME_NOW;
                        if (this._callbackReportEpoch) {
                            this._callbackReportEpoch(DURATION_EPOCH, epoch, logs, this._epochStats);
                            return;
                        }
                        if (epoch === 0) {
                            console.log(EpochStats_1.EpochStats.WriteReportHeader());
                        }
                        console.log((1 + epoch) + '/' + TOTAL_EPOCHS, this._epochStats.WriteReport());
                    }
                }
            });
        });
    }
}
exports.Grid = Grid;
Object.freeze(Grid);
//# sourceMappingURL=Grid.js.map