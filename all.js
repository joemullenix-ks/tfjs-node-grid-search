'use strict';


const { Axis }				= require('./lib/Axis');
const { AxisSet }			= require('./lib/AxisSet');
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

const GO = async () => {

	const AXES = [];

//KEEP: during early dev
// 	AXES.push(new Axis(	Axis.TYPE_LAYERS,
// 						0,		// boundsBegin
// 						100,	// boundsEnd
// 						new Progression(Progression.TYPE_EXPONENTIAL, 1.5)));

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
//	OPTION A: We create the models.
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


//vvvv
const FS = require('fs');
const FS_PROMISES = FS.promises;


//TODO: Support these as launch params.
const DATA_FILEPATH_INPUTS = 'data_inputs.txt';
const DATA_FILEPATH_TARGETS = 'data_targets.txt';

// let textInputs = '';
let textTargets = '';

const FILE_RESULT =	{
						data: null
					};


		ok this mess is finally working. go go go


const READ_DATA_FILE = async (path) => {
// async function ReadSlowly(path) {
	try {
		// await FS_PROMISES.readFile(
		FILE_RESULT.data = await FS_PROMISES.readFile(path);/*,
													(readError, data) => {
														if (readError !== null) {
															throw new Error('readError: ' + readError);
														}

														FILE_RESULT.data = data;
													});
*/
		return
	}
	catch (err) {
		throw new Error('Filed to read file: ' + path + ';' + err);
	}
};

console.log('PRE read file');
await READ_DATA_FILE(DATA_FILEPATH_INPUTS);
console.log('post read file');
return;


const RAW_INPUTS = '';

const RAW_TARGETS = '';
//^^^^^


	//KEEP: Tensor test sandbox:
	// const TENSOR_FLOW = require('@tensorflow/tfjs');
	// 		const D_TENSORIZED_ARRAY = TENSOR_FLOW.tidy(() => { return TENSOR_FLOW.tensor(RAW_INPUTS, [5, 1]); });

	// set aside 100 or 10% of cases, whichever is less, for post-training generalization tests
	const PROOF_PERCENTAGE = RAW_INPUTS.length < 1000
								? 0.1
								: (100 / RAW_INPUTS.length);

/*doom
//TEMP: debugging these, and sick of looking them up
RAW_INPUTS.map((x, i) => console.log('IN', i, x));
RAW_TARGETS.map((x, i) => console.log('TG', i, x));
*/

	const SESSION_DATA = new SessionData(	PROOF_PERCENTAGE,
											RAW_INPUTS,
											RAW_TARGETS,
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

GO();
