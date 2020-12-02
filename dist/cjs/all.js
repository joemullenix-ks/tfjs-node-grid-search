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
Object.defineProperty(exports, "__esModule", { value: true });
const Axis = __importStar(require("./lib/Axis"));
const AxisSet_1 = require("./lib/AxisSet");
const FileIO_1 = require("./lib/FileIO");
const FileIOResult_1 = require("./lib/FileIOResult");
const Grid_1 = require("./lib/Grid");
const GridOptions_1 = require("./lib/GridOptions");
const ModelStatics_1 = require("./lib/ModelStatics");
const PredictionEvaluation_1 = require("./lib/PredictionEvaluation");
const LinearProgression_1 = require("./lib/progression/LinearProgression");
const SessionData_1 = require("./lib/SessionData");
const Utils_1 = require("./lib/Utils");
const MAIN = () => __awaiter(void 0, void 0, void 0, function* () {
    // First, we define the axes for our grid search (the supported axes are enumerated in Axis).
    // For each axis, we set a begin and end boundary, which are inclusive. We also create a progression
    // across that range, i.e. the values at which we'll stop to train and test a model.
    const AXES = [];
    AXES.push(new Axis.Axis(Axis.Types.BATCH_SIZE, 5, // boundsBegin
    10, // boundsEnd
    new LinearProgression_1.LinearProgression(5)));
    /*
        AXES.push(new Axis.Axis(Axis.Types.EPOCHS,
                                10,		// boundsBegin
                                20,		// boundsEnd
                                new FibonacciProgression(4)));
    
        AXES.push(new Axis.Axis(Axis.Types.LAYERS,
                                0,		// boundsBegin
                                1,		// boundsEnd
                                new LinearProgression(1)));
    
        AXES.push(new Axis.Axis(Axis.Types.LEARN_RATE,
                                0.0001,	// boundsBegin
                                0.002,	// boundsEnd
                                new ExponentialProgression(2, 0.01)));
    
        AXES.push(new Axis.Axis(Axis.Types.NEURONS,
                                10,		// boundsBegin
                                30,		// boundsEnd
                                new FibonacciProgression(0)));
    
        AXES.push(new Axis.Axis(Axis.Types.VALIDATION_SPLIT,
                                0.1,	// boundsBegin
                                0.3,	// boundsEnd
                                new LinearProgression(0.2)));
    */
    const AXIS_SET = new AxisSet_1.AxisSet(AXES);
    // Next, we define the static parameters. That is, those params that never change during our grid search.
    //NOTE: Usage options:
    //	OPTION A: We create the models (as shown in this example).
    //		The user instantiates and passes in a ModelStatics. They may supply a value for each non-dyanmic param (i.e.
    //		those without an axis), or accept the default where applicable.
    //
    //	OPTION B: The user creates the models (coming soon).
    //		The user supplies a callback. We invoke the callback each iteration, passing the current value for each
    //		dynamic param (i.e. those with axes). The user then assembles and returns a model.
    const MODEL_STATICS = new ModelStatics_1.ModelStatics({
        batchSize: 10,
        epochs: 5,
        hiddenLayers: 1,
        neuronsPerHiddenLayer: 15,
        validationSplit: 0.25
    });
    // Next, we setup options that will govern the Grid itself, as well as the search process.
    const GRID_OPTIONS = new GridOptions_1.GridOptions({
        epochStatsDepth: 3,
        repetitions: 1,
        validationSetSizeMin: 1000,
        writeResultsToDirectory: '' // ex: "", "c:/my tensorflow project/grid search results"
    });
    // Now we load and configure the data set. A fresh copy of this data will be used to train and test each
    // 'iteration' of the grid search (i.e. each unique combination of dynamic params).
    //TODO: TBD, but this will very likely become a method of a top-level controller, e.g. TFJSGridSearch.js.
    //		At the very least the IO needs try/catch
    const FETCH_DATA = (pathInputs, pathTargets) => __awaiter(void 0, void 0, void 0, function* () {
        const FILE_RESULT = new FileIOResult_1.FileIOResult();
        yield FileIO_1.FileIO.ReadDataFile(pathInputs, FILE_RESULT);
        const RAW_INPUTS = JSON.parse(FILE_RESULT.data);
        yield FileIO_1.FileIO.ReadDataFile(pathTargets, FILE_RESULT);
        const RAW_TARGETS = JSON.parse(FILE_RESULT.data);
        return { inputs: RAW_INPUTS, targets: RAW_TARGETS };
    });
    //TODO: Support these as launch params.
    const DATA_FILEPATH_INPUTS = 'data_inputs.txt';
    const DATA_FILEPATH_TARGETS = 'data_targets.txt';
    const DATA_PACKAGE = yield FETCH_DATA(DATA_FILEPATH_INPUTS, DATA_FILEPATH_TARGETS);
    // set aside 500 or 10% of cases, whichever is less, for post-training generalization tests
    const PROOF_PERCENTAGE = DATA_PACKAGE.inputs.length < 1000
        ? 0.1
        : (500 / DATA_PACKAGE.inputs.length);
    const SESSION_DATA = new SessionData_1.SessionData(PROOF_PERCENTAGE, DATA_PACKAGE.inputs, DATA_PACKAGE.targets, true); // useDefaultStandardization
    // This callback is used by the Grid during generalization testing. After training, the Grid makes a
    // prediction for each proof case. It calls this function, passing the prediction, as well as the targets.
    // If the prediction is acceptable, set the return object's "correct" property to true.
    // An optional "delta" is also available, which takes a value representing the accuracy of the prediction.
    const EVALUATE_PREDICTION = (target, prediction) => {
        // these come in as arbitrarily nested arrays; cast down to our known depth
        const TARGET_2D = target;
        const PREDICTION_2D = prediction;
        const TARGETTED_INDEX = Utils_1.Utils.ArrayFindIndexOfHighestValue(TARGET_2D);
        const PREDICTED_INDEX = Utils_1.Utils.ArrayFindIndexOfHighestValue(PREDICTION_2D);
        //NOTE: This is written for a multi-class (one-hot), classification network.
        //
        //TODO: Write further examples; regression, multi-label classification, more dimensions, etc...
        const EVALUATION = new PredictionEvaluation_1.PredictionEvaluation(TARGETTED_INDEX === PREDICTED_INDEX, 1 - PREDICTION_2D[PREDICTED_INDEX]);
        return EVALUATION;
    };
    // The three remaining callbacks are optional, for tracking statistics during the grid search.
    // If supplied, the Grid will call these with various useful bits of information throughout the search.
    // If no epoch callback is received, Grid will report loss and accuracy values during training.
    const REPORT_BATCH = (duration, batch, logs) => {
        console.log('Batch report', duration, batch, logs, Utils_1.Utils.WriteDurationReport(duration));
    };
    const REPORT_EPOCH = (duration, epoch, logs, epochStats) => {
        console.log('Epoch report', duration, epoch, logs, epochStats, Utils_1.Utils.WriteDurationReport(duration));
    };
    const REPORT_ITERATION = (duration, predictions, proofInputs, proofTargets) => {
        console.log('Iteration report', duration, predictions, proofInputs, proofTargets, Utils_1.Utils.WriteDurationReport(duration));
    };
    // We're now ready to create the Grid, and run the search!
    try {
        const GRID = new Grid_1.Grid(AXIS_SET, MODEL_STATICS, SESSION_DATA, EVALUATE_PREDICTION, GRID_OPTIONS);
        // REPORT_ITERATION,
        // REPORT_EPOCH,
        // REPORT_BATCH);
        yield GRID.Run();
    }
    catch (e) {
        console.log(e);
    }
    console.log('\n' + 'eol');
});
void MAIN();
//# sourceMappingURL=all.js.map