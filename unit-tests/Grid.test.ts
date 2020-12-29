/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';


import * as TENSOR_FLOW from '@tensorflow/tfjs-node';


import {
	Axis,
	AxisSet,
	AxisTypes,
	DataSet,
	EpochStats,
	Grid,
	GridOptions,
	LinearProgression,
	ModelStatics,
	PredictionEvaluation,
	SessionData,
	TFNestedArray
} from '../src/main';


describe('valid instantiation; method failures', () => {
	test('create with minimal arguments', async () => {
		const axes = [];

		axes.push(
			new Axis(
				AxisTypes.BATCH_SIZE,
				2,
				2,
				new LinearProgression(1)
			)
		);

		const axisSet = new AxisSet(axes);

		const modelStatics = new ModelStatics({
			epochs: 1
		});

		const dataSet = new DataSet([[0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1]],
									[[1, 0, 0], [0, 1, 0], [0, 0, 1]]);

		const sessionData = new SessionData(
			0.35,
			dataSet,
			false
		);

		const evaluatePrediction = (_target: number[], _prediction: number[]) => {
			return new PredictionEvaluation(false);
		};

		const grid = new Grid(
			axisSet,
			modelStatics,
			sessionData,
			evaluatePrediction);

		await expect(grid.Run()).resolves.not.toThrow();
	});

	test('create with options; zero hidden layers', async () => {
		const axes = [];

		axes.push(
			new Axis(
				AxisTypes.BATCH_SIZE,
				10,
				10,
				new LinearProgression(1)
			)
		);

		const axisSet = new AxisSet(axes);

		const modelStatics = new ModelStatics({
			epochs: 1,
			hiddenLayers: 0
		});

		const gridOptions = new GridOptions({
			epochStatsDepth: 3,
			validationSetSizeMin: 2,
			writeResultsAsCSV: false
		});

		const dataSet = new DataSet([[0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1]],
									[[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1]]);

		const sessionData = new SessionData(
			0.25,
			dataSet,
			false
		);

		const evaluatePrediction = (_target: number[], _prediction: number[]) => {
			return new PredictionEvaluation(true);
		};

		const grid = new Grid(
			axisSet,
			modelStatics,
			sessionData,
			evaluatePrediction,
			gridOptions);

		await expect(grid.Run()).resolves.not.toThrow();
	});

	test('create with options and reporting callbacks', async () => {
		const axes = [];

		axes.push(
			new Axis(
				AxisTypes.BATCH_SIZE,
				1,
				1,
				new LinearProgression(1)
			)
		);

		const axisSet = new AxisSet(axes);

		const modelStatics = new ModelStatics({
			epochs: 2,
			validationSplit: 0.9
		});

		const gridOptions = new GridOptions({
			epochStatsDepth: 2,
			validationSetSizeMin: 1,
			writeResultsAsCSV: false
		});

		const dataSet = new DataSet([[0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1], [0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1]],
									[[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1]]);

		const sessionData = new SessionData(
			0.5,
			dataSet,
			false
		);

		// send back true and false evaluations, to hit both code paths
		let correctToggler = 0;

		const evaluatePrediction = (_target: number[], _prediction: number[]) => {
			return new PredictionEvaluation(correctToggler++ % 2 === 0);
		};

		const reportIteration = (	duration: number,
									predictions: number[][],
									proofInputs: TFNestedArray,
									proofTargets: number[][]): void => {
			console.log('reportIteration', duration, predictions, proofInputs, proofTargets);
		};

		const reportEpoch = (	duration: number,
								epoch: number,
								logs: TENSOR_FLOW.Logs | undefined,
								epochStats: EpochStats): void => {
			console.log('reportEpoch', duration, epoch, logs, epochStats);
		};

		const reportBatch = (	duration: number,
								batch: number,
								logs: TENSOR_FLOW.Logs | undefined): void => {
			console.log('reportBatch', duration, batch, logs);
		};

		const grid = new Grid(
			axisSet,
			modelStatics,
			sessionData,
			evaluatePrediction,
			gridOptions,
			reportIteration,
			reportEpoch,
			reportBatch);

		await expect(grid.Run()).resolves.not.toThrowError();
	});
});

describe('CSV write options', () => {
	test('include write option', async () => {
		const axes = [];

		axes.push(
			new Axis(
				AxisTypes.BATCH_SIZE,
				2,
				2,
				new LinearProgression(1)
			)
		);

		const axisSet = new AxisSet(axes);

		const modelStatics = new ModelStatics({
			epochs: 1
		});

		const gridOptions = new GridOptions({
			resultsDirectory: '',
			writeResultsAsCSV: true
		});

		const dataSet = new DataSet([[0, 2, 0, 4], [9, 2, 9, 6], [3, 5, 7, 1]],
									[[1, 0, 0], [0, 1, 0], [0, 0, 1]]);

		const sessionData = new SessionData(
			0.35,
			dataSet,
			false
		);

		const evaluatePrediction = (_target: number[], _prediction: number[]) => {
			return new PredictionEvaluation(false);
		};

		const grid = new Grid(
			axisSet,
			modelStatics,
			sessionData,
			evaluatePrediction,
			gridOptions);

		await expect(grid.Run()).resolves.not.toThrow();
	});
});
