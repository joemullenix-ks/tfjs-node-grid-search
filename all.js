'use strict';


//BUG: const TENSOR_FLOW = require('@tensorflow/tfjs-node');
//
//NOTE: Confirmed that this file exists. However, building w/ tfjs-node reports module not found:
//	C:\Users\joeku\OneDrive\_junk\ks\territoriaTFNodeFFS\node_modules\@tensorflow\tfjs-node\lib\napi-v6
//	C:\Users\joeku\OneDrive\_junk\ks\territoriaTFNodeFFS\node_modules\@tensorflow\tfjs-node\lib\napi-v6\tfjs_binding.node


const SIMPLE_STATISTICS		= require('simple-statistics');
const TENSOR_FLOW			= require('@tensorflow/tfjs');

const { Axis }				= require('./lib/Axis');
const { AxisSet }			= require('./lib/AxisSet');
const { Grid }				= require('./lib/Grid');
const { ModelStatics }		= require('./lib/ModelStatics');
const { Progression }		= require('./lib/Progression');


/*
>> PSEUDO

			define grid
				set axes
				build schdule (maybe)

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

AXES.push(new Axis(	Axis.TYPE_LAYERS,
					1,		// boundsBegin
					6,		// boundsEnd
					new Progression(Progression.TYPE_LINEAR, 1)));

AXES.push(new Axis(	Axis.TYPE_NEURONS,
					5,		// boundsBegin
					300,	// boundsEnd
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

const GRID = new Grid(AXIS_SET, MODEL_STATICS);

let pauser = 1;
