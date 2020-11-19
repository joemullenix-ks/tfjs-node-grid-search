'use strict';


//TODO: Once the TS conversion is complete, do a full pass on 'number', subbing in 'bigint' as needed.
//		The first step is to move our TS target to 'ES2020+' (or whatever it is these days).
//		Then we can initialize like this:
//			const TIME: bigint = 0n;
//
//		...as opposed to this:
//			const TIME: bigint = BigInt(0);


const { Axis }						= require('./lib/Axis');
const { AxisSet }					= require('./lib/AxisSet');
const { FileIO }					= require('./lib/FileIO');
const { Grid }						= require('./lib/Grid');
const { ModelStatics }				= require('./lib/ModelStatics');
const { ExponentialProgression }	= require('./lib/progression/ExponentialProgression');
const { FibonacciProgression }		= require('./lib/progression/FibonacciProgression');
const { LinearProgression } 		= require('./lib/progression/LinearProgression');
const { SessionData }				= require('./lib/SessionData');


import * as GridTypes from './ts_types/Grid';


// import { EpochStats } from './lib/EpochStats';
import { FileReadResult } from './lib/FileReadResult';
import { GridOptions } from './lib/GridOptions';
import { Utils } from './lib/Utils';


const MAIN = async () => {

	// First, we define the axes for our grid search (the supported axes are enumerated in Axis).
	// For each axis, we set a begin and end boundary, which are inclusive. We also create a progression
	// across that range, i.e. the values at which we'll stop to train and test a model.

	const AXES = [];

	AXES.push(new Axis(	Axis.TYPE_BATCH_SIZE,
						5,		// boundsBegin
						10,		// boundsEnd
						new LinearProgression(5)));

	AXES.push(new Axis(	Axis.TYPE_EPOCHS,
						10,		// boundsBegin
						20,		// boundsEnd
						new FibonacciProgression(4)));

/*
	AXES.push(new Axis(	Axis.TYPE_LAYERS,
						0,		// boundsBegin
						1,		// boundsEnd
						new LinearProgression(1)));
*/

	AXES.push(new Axis(	Axis.TYPE_LEARN_RATE,
						0.0001,	// boundsBegin
						0.002,		// boundsEnd
						new ExponentialProgression(2, 0.01)));

/*
	AXES.push(new Axis(	Axis.TYPE_NEURONS,
						10,		// boundsBegin
						30,		// boundsEnd
						new FibonacciProgression(0)));

	AXES.push(new Axis(	Axis.TYPE_VALIDATION_SPLIT,
						0.1,	// boundsBegin
						0.3,	// boundsEnd
						new LinearProgression(0.2)));
*/

	const AXIS_SET = new AxisSet(AXES);

	// Next, we define the static parameters. That is, those params that never change during our grid search.

//NOTE: Usage options:
//	OPTION A: We create the models (as shown in this example).
//		The user instantiates and passes in a ModelStatics. They may supply a value for each non-dyanmic param (i.e.
//		those without an axis), or accept the default where applicable.
//
//	OPTION B: The user creates the models (coming soon).
//		The user supplies a callback. We invoke the callback each iteration, passing the current value for each
//		dynamic param (i.e. those with axes). The user then assembles and returns a model.

	const MODEL_STATICS = new ModelStatics(	{
												batchSize: 10,
												epochs: 50,
												hiddenLayers: 1,
												neuronsPerHiddenLayer: 15,
												validationSplit: 0.25
											});

	// Next, we setup options that will govern the Grid itself, as well as the search process.

	const GRID_OPTIONS = new GridOptions(	{
												epochStatsDepth: 3,
												repetitions: 1,
												validationSetSizeMin: 1000,
												writeResultsToDirectory: '' // ex: "c:/my tensorflow project/grid search results"
											});

	// Now we load and configure the data set. A fresh copy of this data will be used to train and test each
	// 'iteration' of the grid search (i.e. each unique combination of dynamic params).


//TODO: TBD, but this will very likely become a method of a top-level controller, e.g. TFJSGridSearch.js.
//		At the very least the IO needs try/catch
	const FETCH_DATA = async (pathInputs: string, pathTargets: string) => {
		const FILE_RESULT =	new FileReadResult();

		await FileIO.ReadDataFile(pathInputs, FILE_RESULT);

		const RAW_INPUTS = JSON.parse(FILE_RESULT.data);

		await FileIO.ReadDataFile(pathTargets, FILE_RESULT);

		const RAW_TARGETS = JSON.parse(FILE_RESULT.data);

		return {inputs: RAW_INPUTS, targets: RAW_TARGETS};
	};

//TODO: Support these as launch params.
	const DATA_FILEPATH_INPUTS = 'data_inputs.txt';
	const DATA_FILEPATH_TARGETS = 'data_targets.txt';

	const DATA_PACKAGE = await FETCH_DATA(DATA_FILEPATH_INPUTS, DATA_FILEPATH_TARGETS);

	// set aside 500 or 10% of cases, whichever is less, for post-training generalization tests
	const PROOF_PERCENTAGE = DATA_PACKAGE.inputs.length < 1000
								? 0.1
								: (500 / DATA_PACKAGE.inputs.length);

	const SESSION_DATA = new SessionData(	PROOF_PERCENTAGE,
											DATA_PACKAGE.inputs,
											DATA_PACKAGE.targets,
											true);						// useDefaultStandardization

	// This callback is used by the Grid during generalization testing. After training, the Grid makes a
	// prediction for each proof case. It calls this function, passing the prediction, as well as the targets.
	// If the prediction is acceptable, set the return object's "correct" property to true.
	// An optional "delta" is also available, which takes a value representing the accuracy of the prediction.
	const EVALUATE_PREDICTION: GridTypes.CallbackEvaluatePrediction = (target, prediction) => {
		const TARGETTED_INDEX = Utils.ArrayFindIndexOfHighestValue(target);

		const PREDICTED_INDEX = Utils.ArrayFindIndexOfHighestValue(prediction);

//NOTE: This is written for a multi-class (one-hot), classification network.
//
//TODO: Write example for regression, multi-label classification, etc...

		return	{
					correct: TARGETTED_INDEX === PREDICTED_INDEX,
					delta: 1 - prediction[PREDICTED_INDEX]
				};
	}

	// The three remaining callbacks are optional, for tracking statistics during the grid search.
	// If supplied, the Grid will call these with various useful bits of information throughout the search.
	// If no epoch callback is received, Grid will report loss and accuracy values during training.

	const REPORT_BATCH: GridTypes.CallbackReportBatch = (duration, batch, logs) => {
		console.log('Batch report', duration, batch, logs, Utils.WriteDurationReport(duration));
	}

	const REPORT_EPOCH: GridTypes.CallbackReportEpoch = (duration, epoch, logs, epochStats) => {
		console.log('Epoch report', duration, epoch, logs, epochStats, Utils.WriteDurationReport(duration));
	}

	const REPORT_ITERATION: GridTypes.CallbackReportIteration = (	duration,
																	predictions,
																	proofInputs,
																	proofTargets) => {
		console.log('Iteration report',
					duration,
					predictions,
					proofInputs,
					proofTargets,
					Utils.WriteDurationReport(duration));
	};

	// We're now ready to create the Grid, and run the search!

	try {
		const GRID = new Grid(	AXIS_SET,
								MODEL_STATICS,
								SESSION_DATA,
								EVALUATE_PREDICTION,
								GRID_OPTIONS,
								REPORT_ITERATION,
								REPORT_EPOCH,
								REPORT_BATCH);

		await GRID.Run();
	}
	catch (e) {
		console.log(e);
	}

	console.log('\n' + 'eol');
};

MAIN();
