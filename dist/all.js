/* eslint-disable @typescript-eslint/no-unused-vars */
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
var Axis = __importStar(require("./lib/Axis"));
var AxisSet_1 = require("./lib/AxisSet");
var FileIO_1 = require("./lib/FileIO");
var FileIOResult_1 = require("./lib/FileIOResult");
var Grid_1 = require("./lib/Grid");
var GridOptions_1 = require("./lib/GridOptions");
var ModelStatics_1 = require("./lib/ModelStatics");
var PredictionEvaluation_1 = require("./lib/PredictionEvaluation");
var LinearProgression_1 = require("./lib/progression/LinearProgression");
var SessionData_1 = require("./lib/SessionData");
var Utils_1 = require("./lib/Utils");
var MAIN = function () { return __awaiter(void 0, void 0, void 0, function () {
    var AXES, AXIS_SET, MODEL_STATICS, GRID_OPTIONS, FETCH_DATA, DATA_FILEPATH_INPUTS, DATA_FILEPATH_TARGETS, DATA_PACKAGE, PROOF_PERCENTAGE, SESSION_DATA, EVALUATE_PREDICTION, REPORT_BATCH, REPORT_EPOCH, REPORT_ITERATION, GRID, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                AXES = [];
                AXES.push(new Axis.Axis(0 /* BATCH_SIZE */, 5, // boundsBegin
                10, // boundsEnd
                new LinearProgression_1.LinearProgression(5)));
                AXIS_SET = new AxisSet_1.AxisSet(AXES);
                MODEL_STATICS = new ModelStatics_1.ModelStatics({
                    batchSize: 10,
                    epochs: 5,
                    hiddenLayers: 1,
                    neuronsPerHiddenLayer: 15,
                    validationSplit: 0.25
                });
                GRID_OPTIONS = new GridOptions_1.GridOptions({
                    epochStatsDepth: 3,
                    repetitions: 1,
                    validationSetSizeMin: 1000,
                    writeResultsToDirectory: '' // ex: "", "c:/my tensorflow project/grid search results"
                });
                FETCH_DATA = function (pathInputs, pathTargets) { return __awaiter(void 0, void 0, void 0, function () {
                    var FILE_RESULT, RAW_INPUTS, RAW_TARGETS;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                FILE_RESULT = new FileIOResult_1.FileIOResult();
                                return [4 /*yield*/, FileIO_1.FileIO.ReadDataFile(pathInputs, FILE_RESULT)];
                            case 1:
                                _a.sent();
                                RAW_INPUTS = JSON.parse(FILE_RESULT.data);
                                return [4 /*yield*/, FileIO_1.FileIO.ReadDataFile(pathTargets, FILE_RESULT)];
                            case 2:
                                _a.sent();
                                RAW_TARGETS = JSON.parse(FILE_RESULT.data);
                                return [2 /*return*/, { inputs: RAW_INPUTS, targets: RAW_TARGETS }];
                        }
                    });
                }); };
                DATA_FILEPATH_INPUTS = 'data_inputs.txt';
                DATA_FILEPATH_TARGETS = 'data_targets.txt';
                return [4 /*yield*/, FETCH_DATA(DATA_FILEPATH_INPUTS, DATA_FILEPATH_TARGETS)];
            case 1:
                DATA_PACKAGE = _a.sent();
                PROOF_PERCENTAGE = DATA_PACKAGE.inputs.length < 1000
                    ? 0.1
                    : (500 / DATA_PACKAGE.inputs.length);
                SESSION_DATA = new SessionData_1.SessionData(PROOF_PERCENTAGE, DATA_PACKAGE.inputs, DATA_PACKAGE.targets, true);
                EVALUATE_PREDICTION = function (target, prediction) {
                    // these come in as arbitrarily nested arrays; cast down to our known depth
                    var TARGET_2D = target;
                    var PREDICTION_2D = prediction;
                    var TARGETTED_INDEX = Utils_1.Utils.ArrayFindIndexOfHighestValue(TARGET_2D);
                    var PREDICTED_INDEX = Utils_1.Utils.ArrayFindIndexOfHighestValue(PREDICTION_2D);
                    //NOTE: This is written for a multi-class (one-hot), classification network.
                    //
                    //TODO: Write further examples; regression, multi-label classification, more dimensions, etc...
                    var EVALUATION = new PredictionEvaluation_1.PredictionEvaluation(TARGETTED_INDEX === PREDICTED_INDEX, 1 - PREDICTION_2D[PREDICTED_INDEX]);
                    return EVALUATION;
                };
                REPORT_BATCH = function (duration, batch, logs) {
                    console.log('Batch report', duration, batch, logs, Utils_1.Utils.WriteDurationReport(duration));
                };
                REPORT_EPOCH = function (duration, epoch, logs, epochStats) {
                    console.log('Epoch report', duration, epoch, logs, epochStats, Utils_1.Utils.WriteDurationReport(duration));
                };
                REPORT_ITERATION = function (duration, predictions, proofInputs, proofTargets) {
                    console.log('Iteration report', duration, predictions, proofInputs, proofTargets, Utils_1.Utils.WriteDurationReport(duration));
                };
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                GRID = new Grid_1.Grid(AXIS_SET, MODEL_STATICS, SESSION_DATA, EVALUATE_PREDICTION, GRID_OPTIONS);
                // REPORT_ITERATION,
                // REPORT_EPOCH,
                // REPORT_BATCH);
                return [4 /*yield*/, GRID.Run()];
            case 3:
                // REPORT_ITERATION,
                // REPORT_EPOCH,
                // REPORT_BATCH);
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 5];
            case 5:
                console.log('\n' + 'eol');
                return [2 /*return*/];
        }
    });
}); };
void MAIN();
//# sourceMappingURL=all.js.map