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


const AXES = [];

//KEEP: during early dev
// AXES.push(new Axis(	Axis.TYPE_LAYERS,
// 					0,		// boundsBegin
// 					100,	// boundsEnd
// 					new Progression(Progression.TYPE_EXPONENTIAL, 1.5)));

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

const RAW_INPUTS = [[7,0.9583277001997803,0.5572808593253387,0,0.10447550370784175,0.2570560320683901,7,0.6849439175665737,0.9968003133519887,14,0.9269855795705277,0.016561178487503492,0,0.07953037407792785,0.1299041787030235],[4,0.3048135674955099,0.2082246919000723,12,0.966559858379646,0.5105583566872276,6,0.5489736064765636,0.6582439707392991,7,0.04861258989368755,0.21571608607482196,1,0.5007474903485496,0.11343114547452204],[2,0.5371112972699434,0.8504448528515982,13,0.4581506826300732,0.8047354356072278,8,0.5770113853900525,0.7576633956802423,1,0.01621422144536533,0.22231914536913422,7,0.29061316972824036,0.2126175419002827],[10,0.5146766468450428,0.5756456522064151,7,0.6240901183756373,0.4978746790219579,12,0.254254153924214,0.8966266023811753,4,0.08348545642893801,0.22131952452650117,20,0.6632900117762215,0.8566847750435318],[0,0.46759558075940477,0.6205023035619959,4,0.7611702006697525,0.621715403604753,4,0.23914562181488774,0.4053487863411769,12,0.8969845565669594,0.3846376215894556,1,0.10101405883817827,0.01503091491336761],[6,0.14276721192762798,0.7834782096760498,8,0.5880743860518789,0.94374371841495,6,0.7615469918098561,0.7527315976789042,24,0.7989387366835079,0.5714203446527293,0,0.15991311689294352,0.8116245262899193],[2,0.3006085917157977,0.794486221990109,19,0.7227521997877897,0.22887816844408304,15,0.04730730610323297,0.2319784926608668,2,0.4765314616345848,0.7479418526486954,1,0.8892943352108154,0.38808333105520765],[16,0.637827978190471,0.4778797961216139,2,0.9008019318098273,0.914512721662381,2,0.390796766184371,0.0652423288444397,3,0.0458684648077925,0.3144026329606111,10,0.2978812940250479,0.9207909297237489],[9,0.8566252550378488,0.2642074812691755,5,0.5360046742280244,0.557857539505183,4,0.8105632242205454,0.5594246911958975,2,0.2967537333144463,0.8319502536883516,11,0.6116145415734575,0.32592133134169887],[4,0.9181809184042622,0.5103277246662998,0,0.5882423231856755,0.2822168892078363,3,0.2277375021159922,0.6344764401491836,0,0.4976235019234674,0.19346110311181808,9,0.29845769469057104,0.9630743044635206]];
const RAW_TARGETS = [[0,1,0,0,0],[1,0,0,0,0],[0,0,0,0,1],[0,0,0,0,1],[0,0,1,0,0],[0,0,0,1,0],[0,1,0,0,0],[1,0,0,0,0],[0,1,0,0,0],[0,0,1,0,0]];

// set aside 100 or 10% of cases, whichever is less, for post-training generalization tests
const PROOF_PERCENTAGE = RAW_INPUTS.length < 1000
							? 0.1
							: (100 / RAW_INPUTS.length);

const TOTAL_INPUT_NEURONS = 15;
const TOTAL_OUTPUT_NEURONS = 5;


//TEMP: debugging these, and sick of looking them up
RAW_INPUTS.map((x, i) => console.log('IN', i, x));
RAW_TARGETS.map((x, i) => console.log('TG', i, x));

/*
console.log('FIRST in0', RAW_INPUTS[0]);
console.log('FIRST tg0', RAW_TARGETS[0]);
console.log('LAST in0', RAW_INPUTS[RAW_INPUTS.length - 1]);
console.log('LAST tg0', RAW_TARGETS[RAW_INPUTS.length - 1]);
*/

const SESSION_DATA = new SessionData(	PROOF_PERCENTAGE,
										RAW_INPUTS,
										RAW_TARGETS,
										TOTAL_INPUT_NEURONS,
										TOTAL_OUTPUT_NEURONS,
										true/*false,
										(rawInputs) => { // callbackStandardize
										},
										(standardizedInputs) => { // callbackUnstandardize
											standardizedInputs[0] = 'fruits';
										}*/);


const GRID = new Grid(AXIS_SET, MODEL_STATICS, SESSION_DATA);

const RUN = async () => {
	await GRID.Run();
};

RUN();

console.log('eol');