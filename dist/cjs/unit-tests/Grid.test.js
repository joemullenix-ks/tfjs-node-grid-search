/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
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
describe('valid instantiation; method failures', () => {
    test('create with minimal arguments', () => {
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
        expect(() => __awaiter(void 0, void 0, void 0, function* () {
            const grid = new main_1.Grid(axisSet, modelStatics, sessionData, evaluatePrediction);
            try {
                yield grid.Run();
            }
            catch (e) {
                console.log('caught', e);
            }
        })).not.toThrow();
    });
    test('create with options; zero hidden layers', () => {
        const axes = [];
        axes.push(new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 10, 10, new main_1.LinearProgression(1)));
        const axisSet = new main_1.AxisSet(axes);
        const modelStatics = new main_1.ModelStatics({
            epochs: 1,
            hiddenLayers: 0
        });
        const gridOptions = new main_1.GridOptions({
            epochStatsDepth: 3
            // writeResultsToDirectory: './'
        });
        const dataSet = new main_1.DataSet([[0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1]], [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        const sessionData = new main_1.SessionData(0.25, dataSet, false);
        const evaluatePrediction = (_target, _prediction) => {
            return new main_1.PredictionEvaluation(true);
        };
        expect(() => __awaiter(void 0, void 0, void 0, function* () {
            const grid = new main_1.Grid(axisSet, modelStatics, sessionData, evaluatePrediction, gridOptions);
            try {
                yield grid.Run();
            }
            catch (e) {
                console.log('caught', e);
            }
        })).not.toThrow();
    });
    test('create with options and reporting callbacks', () => __awaiter(void 0, void 0, void 0, function* () {
        const axes = [];
        axes.push(new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 10, 10, new main_1.LinearProgression(1)));
        const axisSet = new main_1.AxisSet(axes);
        const modelStatics = new main_1.ModelStatics({
            epochs: 1
        });
        const gridOptions = new main_1.GridOptions({
            epochStatsDepth: 3
        });
        const dataSet = new main_1.DataSet([[0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1]], [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        const sessionData = new main_1.SessionData(0.25, dataSet, false);
        // send back true and false evaluations, to hit both code paths
        let correctToggler = 0;
        const evaluatePrediction = (_target, _prediction) => {
            return new main_1.PredictionEvaluation(correctToggler++ % 2 === 0);
        };
        const reportIteration = (duration, predictions, proofInputs, proofTargets) => {
            expect(1).toBe(1);
            console.log('reportIteration', duration, predictions, proofInputs, proofTargets);
        };
        const reportEpoch = (duration, epoch, logs, epochStats) => {
            expect(2).toBe(2);
            console.log('reportEpoch', duration, epoch, logs, epochStats);
        };
        const reportBatch = (duration, batch, logs) => {
            expect(3).toBe(3);
            console.log('reportBatch', duration, batch, logs);
        };
        const grid = new main_1.Grid(axisSet, modelStatics, sessionData, evaluatePrediction, gridOptions, reportIteration, reportEpoch, reportBatch);
        try {
            yield grid.Run();
        }
        catch (e) {
            console.log('caught', e);
        }
    }));
});
//# sourceMappingURL=Grid.test.js.map