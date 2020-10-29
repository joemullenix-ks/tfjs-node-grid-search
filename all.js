'use strict';


//BUG: const TENSOR_FLOW = require('@tensorflow/tfjs-node');
//
//NOTE: Confirmed that this file exists. However, building w/ tfjs-node reports module not found:
//	C:\Users\joeku\OneDrive\_junk\ks\territoriaTFNodeFFS\node_modules\@tensorflow\tfjs-node\lib\napi-v6
//	C:\Users\joeku\OneDrive\_junk\ks\territoriaTFNodeFFS\node_modules\@tensorflow\tfjs-node\lib\napi-v6\tfjs_binding.node


const TENSOR_FLOW			= require('@tensorflow/tfjs');

const { Axis }				= require('./lib/Axis');
const { AxisSet }			= require('./lib/AxisSet');
const { Grid }				= require('./lib/Grid');
const { ModelStatics }		= require('./lib/ModelStatics');
const { Progression }		= require('./lib/Progression');
const { SessionData }		= require('./lib/SessionData');



	// !!! winmerge the sub archive on kupili00; fairly sure it's a partial dupe of the main one



/*
>> PSEUDO
			define model

			generate/fetch data

			GridRun() {
				display schedule
				? maybe timing estimates
				for (axes)
					for (step)
						compile model
						run model
							early out on diverge, overfit, maybe just not-good-enough scores
						proof model
						tally scores
						show report, timing
						save?

				ker done!
					show big report
					save?
			}


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
					2,		// boundsEnd
					new Progression(Progression.TYPE_LINEAR, 1)));

AXES.push(new Axis(	Axis.TYPE_NEURONS,
					20,		// boundsBegin
					5,		// boundsEnd
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

const RAW_INPUTS = [[-0.25279461218492305,0.8032443735088071,-0.04148231393626823,0.43121968093205176,1.2025899099082586,0.25500990235557824,0.7477945020767083,0.6205855389406307,-0.595923222624454,-0.9367593770760382,-0.8348781430462934,-1.181252211146277,-0.017763922934727068,-0.4543156788845414,0.5803370026548065],[-1.3171929792793358,1.7105407732794118,1.3850391165258022,-0.574959574576069,-0.13456342806871135,-0.42152225069810245,-0.22758963106682434,0.22287501004498003,-0.45787314153825576,2.327705118795004,-1.335838052117005,-1.6095858633681437,1.9362675998852574,1.47032262644965,-0.9214574454438741],[0.9446535507962912,-1.6785741896469937,0.16674266611555325,1.149919149152138,0.8977785429759119,-1.4193861374096721,-0.7152816976385907,-0.486303542558538,-0.5128596641047092,0.9083727292858552,1.1186800682174383,-0.07916112678980396,-1.2612385283656262,-0.21823351112849507,1.5356615579728639],[-1.1841431833925342,0.8023637259740009,-1.4972393621257345,1.724878723728207,-0.9531132171731147,1.461201648366121,-1.202973764210357,1.7965422335376173,0.41626094123603324,0.4825730124331106,-0.7012421157138113,0.4380217743267713,-0.017763922934727068,-0.3707286609550478,0.5135381935428538],[0.2794045713622833,-0.16826236858963323,0.5342026347325061,1.149919149152138,1.3708487445071988,1.6808917052166292,-0.8778457198291795,0.7592672861989258,1.1605189261889999,-0.7948261381251233,0.11563982898961576,0.3432586787932438,-1.2612385283656262,-1.0451460646005095,-0.6050940232454518],[1.0777033466830928,-0.6459221010117683,0.8031448215370159,-1.0061792555081208,-1.113450995141263,-1.203786702704998,1.5606146130296523,-1.1177485198447732,1.7044573708959065,-1.220625854977868,-0.4345188692027614,0.7679109248720403,0.6927929944543582,0.7843502100288808,0.7649524891523172],[-0.6519439998453278,0.03351128337398249,-0.8439468374553762,-1.149919149152138,-1.1522958016214278,-0.3803123881331743,-0.5527176754480019,-1.0537815647489355,0.18248051157928885,-0.3690264212723786,1.2423542538211299,-0.6417950150045928,0.6927929944543582,-0.8736360361206481,1.331041156022593],[1.4768527343434976,0.08577567886436098,-0.2776639529647986,0,1.1509159000457787,-0.053406855087896485,1.723178635220241,-1.167904054682128,0.8941244252751258,-0.3690264212723786,1.4017117813424116,-0.8281944688802404,0.8704322238016295,-1.4621605825774198,-1.2221617786523025],[0.8116037549094897,-1.4884722303165128,1.3111691258735874,-0.7186994682200862,-0.28433014413626195,-0.7281834482845985,-0.8778457198291795,-0.7114022951602184,-1.492630971104896,-0.3690264212723786,0.6890765327865387,1.1544094736275445,-0.9059600696710837,1.5769757307342196,-0.8844779341238835],[-1.1841431833925342,0.5457950545643434,-1.539965898302286,-1.0061792555081208,-0.9843795112963666,0.8094945263801125,0.42266645769553074,1.1378699082724455,-1.2985551758030376,0.34063977348219576,-1.2609852850772603,1.6363878335694584,-0.7283208403238123,0.5925719670539117,-1.0923392178799198]];
const RAW_TARGETS = [[0,0,0,0,1],[0,0,0,1,0],[1,0,0,0,0],[0,1,0,0,0],[0,1,0,0,0],[1,0,0,0,0],[0,0,1,0,0],[1,0,0,0,0],[1,0,0,0,0],[0,1,0,0,0]];

// set aside 100 or 10% of cases, whichever is less, for post-training generalization tests
const PROOF_PERCENTAGE = RAW_INPUTS.length < 1000
							? 0.1
							: (100 / RAW_INPUTS.length);

const TOTAL_INPUT_NEURONS = 15;
const TOTAL_OUTPUT_NEURONS = 5;

const SESSION_DATA = new SessionData(	PROOF_PERCENTAGE,
										RAW_INPUTS,
										RAW_TARGETS,
										TOTAL_INPUT_NEURONS,
										TOTAL_OUTPUT_NEURONS);



const GRID = new Grid(AXIS_SET, MODEL_STATICS, SESSION_DATA);

const RUN = async () => {
	await GRID.Run();
};

RUN();

console.log('eol');