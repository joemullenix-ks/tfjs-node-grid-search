'use strict';


const { Axis }				= require('./lib/Axis');
const { AxisSet }			= require('./lib/AxisSet');
const { FileIO }			= require('./lib/FileIO');
const { Grid }				= require('./lib/Grid');
const { ModelStatics }		= require('./lib/ModelStatics');
const { Progression }		= require('./lib/Progression');
const { SessionData }		= require('./lib/SessionData');


/*
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

	AXES.push(new Axis(	Axis.TYPE_LAYERS,
						1,		// boundsBegin
						2,		// boundsEnd
						new Progression(Progression.TYPE_LINEAR, 1)));

	AXES.push(new Axis(	Axis.TYPE_NEURONS,
						2,		// boundsBegin
						3,		// boundsEnd
						new Progression(Progression.TYPE_FIBONACCI)));

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
												hiddenLayers: 2,
												neuronsPerHiddenLayer: 3
											});

//TODO: TDB, but this will very likely become a method of a top-level controller, e.g. TFJSGridSearch.js.
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


	const REPORT_BATCH = (duration) => {
		console.log('Reporting batch', duration);
	}

	const REPORT_EPOCH = (duration) => {
		console.log('Reporting epoch', duration);
	}

	const REPORT_ITERATION = (predictions, proofInputs, proofTargets) => {
		console.log('Reporting iteration'
					+ '; predictions: ' + predictions.length
					+ ', proofInputs: ' + proofInputs.length
					+ ', proofTargets: ' + proofTargets.length);
return;

//vvvv
		// get an unstandardized clone of the proof cases (again, for the human-friendly report)

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

		for (let i = 0; i < PROOF_TARGETS.length; ++i) {
			let delta = 0.0;
			let missReport = '';
			let pass = false;

			const PREDICTED_INDEX = Utils.ArrayFindIndexOfHighestValue(PREDICTIONS[i]);

			let foundOneHot = false;

			for (let p = 0; p < PROOF_TARGETS[i].length; ++p) {
				if (PROOF_TARGETS[i][p] !== 1) {
					// not the one-hot
					continue;
				}

				foundOneHot = true;

				// this is the one-hot, i.e. we expect its prediction to be ~1.0, and thus the rest ~0.0 (inherent to softmax)

				delta = PROOF_TARGETS[i][p] - PREDICTIONS[i][p];

				sumDelta += Math.abs(delta);

				if (p === PREDICTED_INDEX) {
					pass = true;

					++totalCorrect;
				}
				else {
					sumMissDelta += Math.abs(delta);
				}

				missReport = 'pass: ' + (pass ? 'T' : 'f')
							+ '; labels: ' + PROOF_TARGETS[i].toString()
							+ '; prediction: ' + PREDICTIONS[i].map(x => x.toFixed(2)).toString()
							+ '; delta: ' + delta.toFixed(5);

				break;
			}

			if (!foundOneHot) {
				throw new Error('One hot not found; invalid target data[' + i + ']: ' + PROOF_TARGETS[i]);
			}

			RESULTS_TO_SORT.push(	{
										pass: pass,
										delta: Math.abs(delta),
										report: missReport
									});
		}

		const TOTAL_CHECKED = PROOF_TARGETS.length;

		const TOTAL_INCORRECT = TOTAL_CHECKED - totalCorrect;

		console.log('SCORE', (100 * totalCorrect / TOTAL_CHECKED).toFixed(2) + '%');

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

		for (let i = 0; i < PROOF_TARGETS.length; ++i) {
			console.log(i + '/' + PROOF_TARGETS.length + ' | ' + RESULTS_TO_SORT[i].report);
		}
//^^^^
	};


	const GRID = new Grid(	AXIS_SET,
							MODEL_STATICS,
							SESSION_DATA,
							REPORT_ITERATION);
							// REPORT_EPOCH);
							// REPORT_BATCH);

	await GRID.Run();

	console.log('eol');
};

MAIN();
