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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
//BUG: This require() crashes (logged as https://github.com/tensorflow/tfjs/issues/4052):
//
//	const TENSOR_FLOW = require('@tensorflow/tfjs-node');
//
//NOTE: Confirmed that this file exists. However, building w/ tfjs-node reports module not found:
//	<project>\node_modules\@tensorflow\tfjs-node\lib\napi-v6
//	<project>\node_modules\@tensorflow\tfjs-node\lib\napi-v6\tfjs_binding.node
var TENSOR_FLOW = require('@tensorflow/tfjs');
var Axis = __importStar(require("./Axis"));
var AxisSetTraverser_1 = require("./AxisSetTraverser");
var EpochStats = __importStar(require("./EpochStats"));
var FileIO_1 = require("./FileIO");
var FileIOResult_1 = require("./FileIOResult");
var GridOptions_1 = require("./GridOptions");
var GridRunStats_1 = require("./GridRunStats");
var IterationResult_1 = require("./IterationResult");
var ModelParams_1 = require("./ModelParams");
var ModelTestStats_1 = require("./ModelTestStats");
var Utils_1 = require("./Utils");
var Grid = /** @class */ (function () {
    function Grid(axisSet, _modelStatics, _sessionData, _callbackEvaluatePrediction, _userGridOptions, _callbackReportIteration, _callbackReportEpoch, _callbackReportBatch) {
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
    Grid.prototype.CreateModel = function (modelParams) {
        var TOTAL_INPUT_NEURONS = this._sessionData.totalInputNeurons;
        var TOTAL_OUTPUT_NEURONS = this._sessionData.totalOutputNeurons;
        var TOTAL_HIDDEN_LAYERS = modelParams.GetNumericParam("hiddenLayers" /* LAYERS */);
        var TF_MODEL = TENSOR_FLOW.sequential();
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
                units: modelParams.GetNumericParam("neuronsPerHiddenLayer" /* NEURONS */),
                activation: modelParams.GetTextParam('activationInput'),
                useBias: true,
                kernelInitializer: this._modelStatics.GenerateInitializerKernel(),
                biasInitializer: this._modelStatics.GenerateInitializerBias()
            }));
            // add the remaining hidden layers; one-based, because of the built-in input layer
            for (var i = 1; i < TOTAL_HIDDEN_LAYERS; ++i) {
                TF_MODEL.add(TENSOR_FLOW.layers.dense({
                    units: modelParams.GetNumericParam("neuronsPerHiddenLayer" /* NEURONS */),
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
        var LEARNING_RATE = modelParams.GetNumericParam("learnRate" /* LEARN_RATE */);
        // compile the model, which prepares it for training
        TF_MODEL.compile({
            optimizer: this._modelStatics.GenerateOptimizer(LEARNING_RATE),
            loss: this._modelStatics.GenerateLossFunction(),
            metrics: 'accuracy'
        });
        return TF_MODEL;
    };
    Grid.prototype.ResetEpochStats = function () {
        console.assert(this._gridOptions.GetOption('epochStatsDepth') !== undefined);
        //NOTE: This is currently only used by the reporting callback. It's contents, however, will be critical to tracking
        //		overfit and stuck situations, as well as things like Smart Start(tm) (restarting unlucky iterations).
        var EPOCH_STATS_DEPTH = Number(this._gridOptions.GetOption('epochStatsDepth'));
        this._epochStats = new EpochStats.EpochStats(EPOCH_STATS_DEPTH);
    };
    Grid.prototype.Run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var GRID_RUN_STATS, TOTAL_ITERATIONS, TOTAL_REPETITIONS, TOTAL_PASSES, pass, i, DYNAMIC_PARAMS, STATIC_PARAMS, MODEL_PARAMS, r, MODEL, ITERATION_DURATION, MODEL_TEST_STATS, ITERATION_RESULT, GRID_TIME_END, GRID_DURATION, WRITE_RESULTS_OPTION, FILE_RESULT, FILENAME;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        GRID_RUN_STATS = new GridRunStats_1.GridRunStats();
                        TOTAL_ITERATIONS = this._axisSetTraverser.totalIterations;
                        TOTAL_REPETITIONS = Number(this._gridOptions.GetOption('repetitions'));
                        TOTAL_PASSES = TOTAL_ITERATIONS * TOTAL_REPETITIONS;
                        pass = 0;
                        this._timeStartGrid = Date.now();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!!this._axisSetTraverser.traversed) return [3 /*break*/, 7];
                        DYNAMIC_PARAMS = this._axisSetTraverser.CreateIterationParams();
                        STATIC_PARAMS = this._modelStatics.ShallowCloneParams();
                        MODEL_PARAMS = new ModelParams_1.ModelParams(DYNAMIC_PARAMS, STATIC_PARAMS);
                        r = 0;
                        _a.label = 2;
                    case 2:
                        if (!(r < TOTAL_REPETITIONS)) return [3 /*break*/, 5];
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
                        MODEL = this.CreateModel(MODEL_PARAMS);
                        return [4 /*yield*/, this.TrainModel(MODEL, MODEL_PARAMS)];
                    case 3:
                        _a.sent();
                        ITERATION_DURATION = Date.now() - this._timeStartIteration;
                        MODEL_TEST_STATS = this.TestModel(MODEL, MODEL_PARAMS, ITERATION_DURATION);
                        ITERATION_RESULT = new IterationResult_1.IterationResult(i, this._axisSetTraverser.LookupIterationDescriptor(i), this._epochStats, MODEL_PARAMS, MODEL_TEST_STATS, r, ITERATION_DURATION);
                        GRID_RUN_STATS.AddIterationResult(ITERATION_RESULT);
                        _a.label = 4;
                    case 4:
                        ++r;
                        return [3 /*break*/, 2];
                    case 5:
                        this._axisSetTraverser.Advance();
                        _a.label = 6;
                    case 6:
                        ++i;
                        return [3 /*break*/, 1];
                    case 7:
                        GRID_TIME_END = Date.now();
                        GRID_DURATION = GRID_TIME_END - this._timeStartGrid;
                        console.log('\n' + '<< GRID SEARCH COMPLETE >>', '\n', '\n' + 'started @ ' + (new Date(this._timeStartGrid)).toLocaleString(), '\n' + '  ended @ ' + (new Date(GRID_TIME_END)).toLocaleString(), '\n' + 'duration: ' + Utils_1.Utils.WriteDurationReport(GRID_DURATION), '\n');
                        console.log('Results (sorted by score)');
                        console.log(GRID_RUN_STATS.WriteReport(true));
                        WRITE_RESULTS_OPTION = this._gridOptions.GetOption('writeResultsToDirectory');
                        if (!(typeof WRITE_RESULTS_OPTION === 'string')) return [3 /*break*/, 9];
                        FILE_RESULT = new FileIOResult_1.FileIOResult();
                        FILENAME = FileIO_1.FileIO.ProduceResultsFilename();
                        return [4 /*yield*/, FileIO_1.FileIO.WriteResultsFile(FILENAME, WRITE_RESULTS_OPTION, GRID_RUN_STATS.WriteCSV(), FILE_RESULT)];
                    case 8:
                        _a.sent();
                        //TODO: Look into Node's os/platform library. Gotta be a way to pull the appropriate slashes.
                        //		...and on the same pass, lookup and print the root directory.
                        console.log('\n'
                            + 'Results file written as '
                            + (WRITE_RESULTS_OPTION === ''
                                ? './'
                                : WRITE_RESULTS_OPTION + '/')
                            + FILENAME);
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Grid.prototype.ResolveModelDefinition = function () {
        //NOTE: TODO: Not entirely happy with this. It feels like access breaking; reaching in via callback.
        //			  It would be better to just produce a list of axis keys. That's all we want, anyway.
        //			  ...will leave this pending the completion of the supported axes. There may be more
        //			  to consider when it comes to complex axes like activator-schedules.
        var _this = this;
        // ensure the static and dynamic model parameters have no overlap, by stripping any dupes from the statics
        this._axisSetTraverser.ExamineAxisNames(function (axisKey) {
            _this._modelStatics.AttemptStripParam(axisKey);
        });
    };
    //TODO: This model type might be too strict. Consider the lower-level TF LayersModel.
    Grid.prototype.TestModel = function (model, modelParams, duration) {
        console.assert(model.built);
        console.assert(duration >= 0);
        console.log('Testing...');
        // run the unseen data through this trained model
        var PREDICTIONS_TENSOR = model.predict(this._sessionData.proofInputsTensor, {
            batchSize: modelParams.GetNumericParam("batchSize" /* BATCH_SIZE */),
            //NOTE: 'verbose' is not implemented as of TF 2.7.0. The documentation is wrong, but it's noted in the lib (see model.ts).
            verbose: false
        });
        // convert this TF Tensor into array form, for human-friendly analysis
        var PREDICTIONS = PREDICTIONS_TENSOR.arraySync();
        // pull the unstandardized proof cases (again, for the human-friendly report)
        var PROOF_INPUTS = this._sessionData.rawInputsProof;
        var PROOF_TARGETS = this._sessionData.proofTargets;
        console.assert(PROOF_TARGETS.length === PREDICTIONS.length); // sanity-check
        if (this._callbackReportIteration) {
            this._callbackReportIteration(duration, PREDICTIONS, PROOF_INPUTS, PROOF_TARGETS);
        }
        // we now 'score' the predictions by tallying the responses from the user's callback
        var aggregateDeltaCorrect = 0.0;
        var aggregateDeltaIncorrect = 0.0;
        var totalCorrect = 0;
        for (var i = 0; i < PREDICTIONS.length; ++i) {
            // send each targets-prediction pair to the user, for their scoring logic
            var EVALUATION = this._callbackEvaluatePrediction(PROOF_TARGETS[i], PREDICTIONS[i]);
            if (EVALUATION.correct) {
                ++totalCorrect;
                aggregateDeltaCorrect += EVALUATION.delta;
            }
            else {
                aggregateDeltaIncorrect += EVALUATION.delta;
            }
        }
        var MODEL_TEST_STATS = new ModelTestStats_1.ModelTestStats(aggregateDeltaCorrect, aggregateDeltaIncorrect, totalCorrect, PREDICTIONS.length);
        console.log('Test complete. Score: ' + (100 * MODEL_TEST_STATS.CalculateScore()).toFixed(3) + '%');
        return MODEL_TEST_STATS;
    };
    //TODO: This model type might be too strict. Consider the lower-level TF LayersModel.
    Grid.prototype.TrainModel = function (model, modelParams) {
        return __awaiter(this, void 0, void 0, function () {
            var TOTAL_CASES, TOTAL_VALIDATION_CASES, TOTAL_TRAINING_CASES, TOTAL_EPOCHS;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.assert(model.built);
                        this.ResetEpochStats();
                        TOTAL_CASES = this._sessionData.totalTrainingCases;
                        TOTAL_VALIDATION_CASES = Math.ceil(TOTAL_CASES * modelParams.GetNumericParam("validationSplit" /* VALIDATION_SPLIT */));
                        TOTAL_TRAINING_CASES = TOTAL_CASES - TOTAL_VALIDATION_CASES;
                        if (TOTAL_VALIDATION_CASES <= this._gridOptions.GetOption('validationSetSizeMin')) {
                            console.warn('Validation split is extremely low, and may not produce useful results.');
                        }
                        if (TOTAL_TRAINING_CASES <= this._gridOptions.GetOption('validationSetSizeMin')) {
                            console.warn('Validation split is extremely high, and may not produce useful results.');
                        }
                        TOTAL_EPOCHS = modelParams.GetNumericParam("epochs" /* EPOCHS */);
                        console.log('Training with ' + TOTAL_CASES + ' cases ('
                            + TOTAL_TRAINING_CASES + ' train, '
                            + TOTAL_VALIDATION_CASES + ' validate) '
                            + 'for ' + TOTAL_EPOCHS + ' epochs...');
                        return [4 /*yield*/, model.fit(this._sessionData.trainingInputsTensor, this._sessionData.trainingTargetsTensor, {
                                batchSize: modelParams.GetNumericParam("batchSize" /* BATCH_SIZE */),
                                epochs: TOTAL_EPOCHS,
                                shuffle: true,
                                verbose: 2,
                                //NOTE: Validation is only performed if we provide this "validationSplit" arg. It's necessary to track overfit and stuck.
                                validationSplit: modelParams.GetNumericParam("validationSplit" /* VALIDATION_SPLIT */),
                                callbacks: {
                                    //NOTE: These events are available, as of TF 2.7.0:
                                    // 								onTrainBegin: (logs) => { console.log('onTrainBegin', logs); },
                                    // 								onTrainEnd: (logs) => { console.log('onTrainEnd', logs); },
                                    // 								onEpochBegin: (epoch, logs) => { console.log('onEpochBegin', epoch, logs); },
                                    // 								onEpochEnd: (epoch, logs) => { console.log('onEpochEnd', epoch, logs); },
                                    // 								onBatchBegin: (batch, logs) => { console.log('onBatchBegin', batch, logs); },
                                    // 								onBatchEnd: (batch, logs) => { console.log('onBatchEnd', batch, logs); },
                                    // 								onYield: (epoch, batch, logs) => { console.log('onYield', epoch, batch, logs); }
                                    //[[TF ANY]]
                                    onBatchEnd: function (batch, logs) {
                                        //TODO: This is essentially duped by the Epoch handler (just below).
                                        if (!_this._callbackReportBatch) {
                                            return;
                                        }
                                        var TIME_NOW = Date.now();
                                        var DURATION_BATCH = TIME_NOW - _this._timeStartBatch;
                                        _this._timeStartBatch = TIME_NOW;
                                        _this._callbackReportBatch(DURATION_BATCH, batch, logs);
                                    },
                                    //[[TF ANY]]
                                    onEpochEnd: function (epoch, logs) {
                                        _this._epochStats.Update(epoch, logs);
                                        var TIME_NOW = Date.now();
                                        var DURATION_EPOCH = TIME_NOW - _this._timeStartEpoch;
                                        _this._timeStartEpoch = TIME_NOW;
                                        if (_this._callbackReportEpoch) {
                                            _this._callbackReportEpoch(DURATION_EPOCH, epoch, logs, _this._epochStats);
                                            return;
                                        }
                                        if (epoch === 0) {
                                            console.log(EpochStats.REPORT_HEADER);
                                        }
                                        console.log((1 + epoch) + '/' + TOTAL_EPOCHS, _this._epochStats.WriteReport());
                                    }
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Grid;
}());
exports.Grid = Grid;
Object.freeze(Grid);
//# sourceMappingURL=Grid.js.map