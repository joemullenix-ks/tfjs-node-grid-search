'use strict';


const { Axis }				= require('./lib/Axis');
const { AxisSet }			= require('./lib/AxisSet');
const { FileIO }			= require('./lib/FileIO');
const { Grid }				= require('./lib/Grid');
const { ModelStatics }		= require('./lib/ModelStatics');
const { ExponentialProgression } = require('./lib/progression/ExponentialProgression');
const { FibonacciProgression } = require('./lib/progression/FibonacciProgression');
// const { Progression }		= require('./lib/Progression');
const { LinearProgression } = require('./lib/progression/LinearProgression');
const { SessionData }		= require('./lib/SessionData');
const { Utils }				= require('./lib/Utils');


/*
>> TODOS !!!!!!!!!
	~ Lots more model params to support as axes
	Run custom models via callback
	Separate the concept of pass (repetition of iteration) and iteration (grid cell)
	Write the friggin model/weight files (if we can get around that bug)
	Smart-start
	Do a BASIC auto-abort on overfit and stuck
		eventually give user options/callbacks that drive that
	Then project upgrades; Lint, TS, Travis, JSDOC, public Git, NPM


>> IDEAS !!!!!!!!!
	FORK/SPAWN brother! simulrun

	ITERATIONS PER RUN ooo baby

	LAYER SIZE DECAY/GROW (left to right)

	SMART START !! skip unlucky weight rolls
		for a given config, run five times for 1 epoch;
		take the 2nd or 3rd place score, and use that as min-acceptable;
		abort and retry all runs that don't hit that baseline opening
*/


const MAIN = async () => {

	const AXES = [];

/*
	AXES.push(new Axis(	Axis.TYPE_BATCH_SIZE,
						1,		// boundsBegin
						50,		// boundsEnd
						new ExponentialProgression(1.5, 0.5)));
*/

	AXES.push(new Axis(	Axis.TYPE_EPOCHS,
						10,		// boundsBegin
						100,		// boundsEnd
						new FibonacciProgression(4)));

/*
	AXES.push(new Axis(	Axis.TYPE_LAYERS,
						0,		// boundsBegin
						1,		// boundsEnd
						new LinearProgression(3)));

	AXES.push(new Axis(	Axis.TYPE_NEURONS,
						10,		// boundsBegin
						20,		// boundsEnd
						new Progression(Progression.TYPE_LINEAR, 5, null, true)));

	AXES.push(new Axis(	Axis.TYPE_VALIDATION_SPLIT,
						0.1,		// boundsBegin
						0.4,		// boundsEnd
						new Progression(Progression.TYPE_LINEAR, 0.15, null, false)));
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

	const MODEL_STATICS = new ModelStatics(	AXIS_SET,
											{
												// batchSize: 10,
												epochs: 10,
												hiddenLayers: 1,
												neuronsPerHiddenLayer: 15,
												// validationSplit: 0.25
											});

//TODO: TBD, but this will very likely become a method of a top-level controller, e.g. TFJSGridSearch.js.
//		At the very least the IO needs try/catch
	const FETCH_DATA = async (pathInputs, pathTargets) => {
		const FILE_RESULT =	{};

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

	// set aside 100 or 10% of cases, whichever is less, for post-training generalization tests
	const PROOF_PERCENTAGE = DATA_PACKAGE.inputs.length < 1000
								? 0.1
								: (100 / DATA_PACKAGE.inputs.length);

	const SESSION_DATA = new SessionData(	PROOF_PERCENTAGE,
											DATA_PACKAGE.inputs,
											DATA_PACKAGE.targets,
											true);						// useDefaultStandardization
/*KEEP: Standardization via callbacks:
											(rawInputs) => {			// callbackStandardize
//NOTE: This example walks nested arrays, modifying each feature value.
// 												const RECURSIVELY_MODIFY_FEATURES = (a) => {
// 													a.forEach((value, index, array) => {
// 														if (Array.isArray(value)) {
// 															RECURSIVELY_STANDARDIZE_FEATURES(value);
// 															return;
// 														}
//
// 														array[index] /= 2; // feature modifications happen here
// 													});
// 												};
//
// 												RECURSIVELY_MODIFY_FEATURES(rawInputs);
											},
											null);						// callbackUnstandardize
*/


	const EVALUATE_PREDICTION = (target, prediction) => {
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

	const REPORT_BATCH = (duration, batch, logs) => {
		console.log('Batch report', duration, Utils.WriteDurationReport(duration));
	}

	const REPORT_EPOCH = (duration, epoch, logs, epochStats) => {
		console.log('Epoch report', duration, Utils.WriteDurationReport(duration));
	}

	const REPORT_ITERATION = (duration, predictions, proofInputs, proofTargets) => {
		console.log('Iteration report', duration, Utils.WriteDurationReport(duration));

		let totalCorrect = 0;

		const REPORTING_DECIMALS = 2;

		let sumDelta = 0.0;

		let sumMissDelta = 0.0;

		const RESULTS_TO_SORT = [];

//TODO: This is custom; actually the whole process is! Lift it out into a callback.
		const WRITE_INPUTS_ENTRY = (a, b, c) => {
			return (b % 3 === 0
					? (a < 10 ? '0' : '') + a
					: a.toFixed(3)); // every third entry is UINT; others are UNIT SCALAR
		};

		for (let i = 0; i < predictions.length; ++i) {
			let delta = 0.0;
			let missReport = '';
			let pass = false;

			const PREDICTED_INDEX = Utils.ArrayFindIndexOfHighestValue(predictions[i]);

			let foundOneHot = false;

			for (let p = 0; p < proofTargets[i].length; ++p) {
				if (proofTargets[i][p] !== 1) {
					// not the one-hot
					continue;
				}

				foundOneHot = true;

				// this is the one-hot, i.e. we expect its prediction to be ~1.0, and thus the rest ~0.0 (inherent to softmax)

				delta = proofTargets[i][p] - predictions[i][p];

				sumDelta += Math.abs(delta);

				if (p === PREDICTED_INDEX) {
					pass = true;

					++totalCorrect;
				}
				else {
					sumMissDelta += Math.abs(delta);
				}

				missReport = 'pass: ' + (pass ? 'T' : 'f')
							+ '; labels: ' + proofTargets[i].toString()
							+ '; prediction: ' + predictions[i].map(x => x.toFixed(2)).toString()
							+ '; delta: ' + delta.toFixed(5);

				break;
			}

			if (!foundOneHot) {
				throw new Error('One hot not found; invalid target data[' + i + ']: ' + proofTargets[i]);
			}

			RESULTS_TO_SORT.push(	{
										pass: pass,
										delta: Math.abs(delta),
										report: missReport
									});
		}

		const TOTAL_CHECKED = proofTargets.length;

		const TOTAL_INCORRECT = TOTAL_CHECKED - totalCorrect;

		console.log('SCORE', (100 * totalCorrect / TOTAL_CHECKED).toFixed(2) + '%');

/*KEEP: All good stuff, but too spammy for now; will move into a generalized reporting modules.
		console.log(totalCorrect + '/' + TOTAL_CHECKED, '(' + TOTAL_INCORRECT + ' incorrect)');

		console.log('AVE. MISS DELTA', (TOTAL_INCORRECT === 0
										? 'zero incorrect' // custom text in lieu of div-by-zero
										: (sumMissDelta / TOTAL_INCORRECT).toFixed(6)));

		console.log('AVE. DELTA', (sumDelta / TOTAL_CHECKED).toFixed(6));

		console.log('AVE. HIT DELTA', totalCorrect === 0
										? 'zero correct' // custom text in lieu of div-by-zero
										: ((sumDelta - sumMissDelta) / totalCorrect).toFixed(6));

		console.log('PROOF CASE DETAILS');

		// sort by cumulative miss-delta, closest first
		RESULTS_TO_SORT.sort((a, b) => {
			return parseFloat(a.delta) - parseFloat(b.delta);
		});

		for (let i = 0; i < proofTargets.length; ++i) {
			console.log(i + '/' + proofTargets.length + ' | ' + RESULTS_TO_SORT[i].report);
		}
*/
	};

	try {
		const GRID = new Grid(	AXIS_SET,
								MODEL_STATICS,
								SESSION_DATA,
								EVALUATE_PREDICTION,
								{
									repetitions: 1,
									writeResultsToDirectory: 'c:/_scratch/wipeit' // ex: "c:\\my tensorflow project\\grid search results"

								});
								// REPORT_ITERATION);
								// REPORT_EPOCH);
								// REPORT_BATCH);

		await GRID.Run();
	}
	catch (e) {
		console.log(e);
	}

	console.log('\n' + 'eol');
};

MAIN();
