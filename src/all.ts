'use strict';

import { EpochStats } from './lib/EpochStats';
import { FileReadResult } from './lib/FileReadResult';
//KEEP: This is giving me 'not a module'. Is that because it's an Object, rather than a class? We'll see.
// import { Utils } from './lib/Utils';

import { TFInputsArray } from './ts_types/custom';


const { Axis }						= require('./lib/Axis');
const { AxisSet }					= require('./lib/AxisSet');
const { FileIO }					= require('./lib/FileIO');
const { Grid }						= require('./lib/Grid');
const { ModelStatics }				= require('./lib/ModelStatics');
const { ExponentialProgression }	= require('./lib/progression/ExponentialProgression');
const { FibonacciProgression }		= require('./lib/progression/FibonacciProgression');
const { LinearProgression } 		= require('./lib/progression/LinearProgression');
const { SessionData }				= require('./lib/SessionData');
const { Utils }						= require('./lib/Utils');

const MAIN = async () => {

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

//NOTE: Usage options:
//	OPTION A: We create the models (as shown in this example).
//		The user instantiates and passes in a ModelStatics. They may supply a value for each non-dyanmic param (i.e.
//		those without an axis), or accept the default where applicable.
//
//	OPTION B: The user creates the models.
//		The user supplies a callback. We invoke the callback each iteration, passing the current value for each
//		dynamic param (i.e. those with axes). The user then assembles and returns a model.

	const MODEL_STATICS = new ModelStatics(	{
												batchSize: 10,
												epochs: 50,
												hiddenLayers: 1,
												neuronsPerHiddenLayer: 15,
												validationSplit: 0.25
											});

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

	const EVALUATE_PREDICTION = (target: Array<number>, prediction: Array<number>) => {
//NOTE: This is written for a multi-class (one-hot), classification network.
//
//TODO: Write example for regression, multi-label classification, etc...

		const TARGETTED_INDEX = Utils.ArrayFindIndexOfHighestValue(target);

		const PREDICTED_INDEX = Utils.ArrayFindIndexOfHighestValue(prediction);

		return	{
					correct: TARGETTED_INDEX === PREDICTED_INDEX,
					delta: 1 - prediction[PREDICTED_INDEX]
				};
	}

//[[TF ANY]]
	const REPORT_BATCH = (duration: number, batch: any, logs: any) => {
		Math.random() < 0.00001 && console.log('Batch report', duration, batch, logs, Utils.WriteDurationReport(duration));
	}

//[[TF ANY]]
	const REPORT_EPOCH = (duration: number, epoch: number, logs: any, epochStats: typeof EpochStats) => {
		Math.random() < 0.00001 && console.log('Epoch report', duration, epoch, logs, epochStats, Utils.WriteDurationReport(duration));
	}


// //vv TODO: File this away ... somewhere. Likely a new types file. Maaaybe SessionData.

// // WEEEEEEEEEEEEEEE!, but I don't see another way
// type ArrayOrder2 = Array<Array<number>>;
// type ArrayOrder3 = Array<Array<Array<number>>>;
// type ArrayOrder4 = Array<Array<Array<Array<number>>>>;
// type ArrayOrder5 = Array<Array<Array<Array<Array<number>>>>>;
// type ArrayOrder6 = Array<Array<Array<Array<Array<Array<number>>>>>>;

// type TFInputsArray = ArrayOrder2 | ArrayOrder3 | ArrayOrder4 | ArrayOrder5 | ArrayOrder6;
// //^^


	const REPORT_ITERATION = (	duration: number,
								predictions: Array<number>,
								proofInputs: TFInputsArray,
								proofTargets: Array<number>) => {
		console.log('Iteration report',
					duration,
					predictions,
					proofInputs,
					proofTargets,
					Utils.WriteDurationReport(duration));
	};

	try {
		const GRID = new Grid(	AXIS_SET,
								MODEL_STATICS,
								SESSION_DATA,
								EVALUATE_PREDICTION,
								{
									epochStatsDepth: 3,
									repetitions: 1,
									validationSetSizeMin: 1000,
									writeResultsToDirectory: '' // ex: "c:/my tensorflow project/grid search results"
								},
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
