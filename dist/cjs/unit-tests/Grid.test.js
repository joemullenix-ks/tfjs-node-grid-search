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
const main_1 = require("../src/main");
//vvvv FILESYSTEM MOCKUP (integration tests touch the disk, not unit tests)
const FS_PROMISES_MOCKUP = __importStar(require("fs/promises"));
jest.mock('fs/promises');
//NOTE: This horrendous 'any' cast is for TypeScript's compiler. It's only been
//		permitted because this usage is quarantined within unit tests.
//
//TODO: Dig further into Jest. There must be another way.
FS_PROMISES_MOCKUP.writeFile.mockImplementation((_path, _data, _encoding) => {
    return Promise.resolve('write file mockup pass');
});
//^^^^
describe('valid instantiation; method failures', () => {
    test('create with minimal arguments', () => __awaiter(void 0, void 0, void 0, function* () {
        const axes = [];
        axes.push(new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 2, 2, new main_1.LinearProgression(1)));
        const axisSet = new main_1.AxisSet(axes);
        const modelStatics = new main_1.ModelStatics({
            epochs: 1
        });
        const dataSet = new main_1.DataSet([[0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1]], [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        const sessionData = new main_1.SessionData(0.35, dataSet, false);
        const evaluatePrediction = (_target, _prediction) => {
            return new main_1.PredictionEvaluation(false);
        };
        const grid = new main_1.Grid(axisSet, modelStatics, sessionData, evaluatePrediction);
        yield expect(grid.Run()).resolves.not.toThrow();
    }));
    test('create with options; zero hidden layers', () => __awaiter(void 0, void 0, void 0, function* () {
        const axes = [];
        axes.push(new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 10, 10, new main_1.LinearProgression(1)));
        const axisSet = new main_1.AxisSet(axes);
        const modelStatics = new main_1.ModelStatics({
            epochs: 1,
            hiddenLayers: 0
        });
        const gridOptions = new main_1.GridOptions({
            epochStatsDepth: 3,
            validationSetSizeMin: 2,
            writeResultsAsCSV: false
        });
        const dataSet = new main_1.DataSet([[0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1]], [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        const sessionData = new main_1.SessionData(0.25, dataSet, false);
        const evaluatePrediction = (_target, _prediction) => {
            return new main_1.PredictionEvaluation(true);
        };
        const grid = new main_1.Grid(axisSet, modelStatics, sessionData, evaluatePrediction, gridOptions);
        yield expect(grid.Run()).resolves.not.toThrow();
    }));
    test('create with options and reporting callbacks', () => __awaiter(void 0, void 0, void 0, function* () {
        const axes = [];
        axes.push(new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 1, 1, new main_1.LinearProgression(1)));
        const axisSet = new main_1.AxisSet(axes);
        const modelStatics = new main_1.ModelStatics({
            epochs: 2,
            validationSplit: 0.9
        });
        const gridOptions = new main_1.GridOptions({
            epochStatsDepth: 2,
            validationSetSizeMin: 1,
            writeResultsAsCSV: false
        });
        const dataSet = new main_1.DataSet([[0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1]], [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        const sessionData = new main_1.SessionData(0.5, dataSet, false);
        // send back true and false evaluations, to hit both code paths
        let correctToggler = 0;
        const evaluatePrediction = (_target, _prediction) => {
            return new main_1.PredictionEvaluation(correctToggler++ % 2 === 0);
        };
        const reportIteration = (duration, predictions, proofInputs, proofTargets) => {
            console.log('reportIteration', duration, predictions, proofInputs, proofTargets);
        };
        const reportEpoch = (duration, epoch, logs, epochStats) => {
            console.log('reportEpoch', duration, epoch, logs, epochStats);
        };
        const reportBatch = (duration, batch, logs) => {
            console.log('reportBatch', duration, batch, logs);
        };
        const grid = new main_1.Grid(axisSet, modelStatics, sessionData, evaluatePrediction, gridOptions, reportIteration, reportEpoch, reportBatch);
        yield expect(grid.Run()).resolves.not.toThrowError();
    }));
});
describe('CSV write options', () => {
    test('include write option', () => __awaiter(void 0, void 0, void 0, function* () {
        const axes = [];
        axes.push(new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 2, 2, new main_1.LinearProgression(1)));
        const axisSet = new main_1.AxisSet(axes);
        const modelStatics = new main_1.ModelStatics({
            epochs: 1
        });
        const gridOptions = new main_1.GridOptions({
            resultsDirectory: '',
            writeResultsAsCSV: true
        });
        const dataSet = new main_1.DataSet([[0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1]], [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        const sessionData = new main_1.SessionData(0.35, dataSet, false);
        const evaluatePrediction = (_target, _prediction) => {
            return new main_1.PredictionEvaluation(false);
        };
        const grid = new main_1.Grid(axisSet, modelStatics, sessionData, evaluatePrediction, gridOptions);
        yield expect(grid.Run()).resolves.not.toThrow();
    }));
});
//# sourceMappingURL=Grid.test.js.map