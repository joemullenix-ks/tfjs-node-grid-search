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
import { Axis, AxisSet, AxisTypes, DataSet, Grid, GridOptions, LinearProgression, ModelStatics, PredictionEvaluation, SessionData } from '../src/main';
describe('valid instantiation; method failures', () => {
    test('create with minimal arguments', () => {
        const axes = [];
        axes.push(new Axis(AxisTypes.BATCH_SIZE, 2, 2, new LinearProgression(1)));
        const axisSet = new AxisSet(axes);
        const modelStatics = new ModelStatics({
            epochs: 1
        });
        const dataSet = new DataSet([[0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1]], [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        const sessionData = new SessionData(0.35, dataSet, false);
        const evaluatePrediction = (_target, _prediction) => {
            return new PredictionEvaluation(false, 0.0);
        };
        expect(() => __awaiter(void 0, void 0, void 0, function* () {
            const grid = new Grid(axisSet, modelStatics, sessionData, evaluatePrediction);
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
        axes.push(new Axis(AxisTypes.BATCH_SIZE, 10, 10, new LinearProgression(1)));
        const axisSet = new AxisSet(axes);
        const modelStatics = new ModelStatics({
            epochs: 1,
            hiddenLayers: 0
        });
        const gridOptions = new GridOptions({
            epochStatsDepth: 3
            // writeResultsToDirectory: './'
        });
        const dataSet = new DataSet([[0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1]], [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        const sessionData = new SessionData(0.25, dataSet, false);
        const evaluatePrediction = (_target, _prediction) => {
            return new PredictionEvaluation(true, 0.0);
        };
        expect(() => __awaiter(void 0, void 0, void 0, function* () {
            const grid = new Grid(axisSet, modelStatics, sessionData, evaluatePrediction, gridOptions);
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
        axes.push(new Axis(AxisTypes.BATCH_SIZE, 10, 10, new LinearProgression(1)));
        const axisSet = new AxisSet(axes);
        const modelStatics = new ModelStatics({
            epochs: 1
        });
        const gridOptions = new GridOptions({
            epochStatsDepth: 3
        });
        const dataSet = new DataSet([[0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1]], [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        const sessionData = new SessionData(0.25, dataSet, false);
        // send back true and false evaluations, to hit both code paths
        let correctToggler = 0;
        const evaluatePrediction = (_target, _prediction) => {
            return new PredictionEvaluation(correctToggler++ % 2 === 0, 0.0);
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
        const grid = new Grid(axisSet, modelStatics, sessionData, evaluatePrediction, gridOptions, reportIteration, reportEpoch, reportBatch);
        try {
            yield grid.Run();
        }
        catch (e) {
            console.log('caught', e);
        }
    }));
});
//# sourceMappingURL=Grid.test.js.map