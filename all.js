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

	LAYER SIZE DECAY (left to right)

	SMART START !! skip unlucky weight rolls
		for a given config, run five times for 1 epoch;
		take the 2nd or 3rd place score, and use that as min-acceptable;
		abort and retry all runs that don't hit that baseline opening
*/


const MAIN = async () => {

	const AXES = [];

	AXES.push(new Axis(	Axis.TYPE_LAYERS,
						0,		// boundsBegin
						5,		// boundsEnd
						new Progression(Progression.TYPE_LINEAR, 1)));

	AXES.push(new Axis(	Axis.TYPE_NEURONS,
						2,		// boundsBegin
						50,		// boundsEnd
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

	const GRID = new Grid(AXIS_SET, MODEL_STATICS, SESSION_DATA);

	await GRID.Run();

	console.log('eol');
};

MAIN();
