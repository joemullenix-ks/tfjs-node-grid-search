'use strict';


/*
//TDOO: Merge these into a single index.d.ts
export * as Types from './ts_types/common';
export * as GridTypes from './ts_types/Grid';
*/


//TDOO: This becomes abstract with subs, eliminating the enums
export { Axis, Defaults as AxisDefaults, Names as AxisNames, Types as AxisTypes } from './lib/Axis';
export { AxisSet }					from './lib/AxisSet';
export { AxisSetTraverser }			from './lib/AxisSetTraverser';

//TODO: doom this one (npm namespace tester)
export { DateTime }					from './lib/DateTime';

export { EpochStats }				from './lib/EpochStats';
export { FailureMessage }			from './lib/FailureMessage';
export { FileIO }					from './lib/FileIO';
export { FileIOResult } 			from './lib/FileIOResult';
export { Grid }						from './lib/Grid';
export { GridOptions } 				from './lib/GridOptions';
export { GridRunStats } 			from './lib/GridRunStats';
export { IterationResult } 			from './lib/IterationResult';
export { ModelParams } 				from './lib/ModelParams';
export { ModelStatics } 			from './lib/ModelStatics';
export { ModelTestStats } 			from './lib/ModelTestStats';
export { PredictionEvaluation } 	from './lib/PredictionEvaluation';
export { Progression }				from './lib/Progression';
export { ExponentialProgression }	from './lib/progression/ExponentialProgression';
export { FibonacciProgression }		from './lib/progression/FibonacciProgression';
export { LinearProgression } 		from './lib/progression/LinearProgression';
export { SessionData }				from './lib/SessionData';
export { Utils } 					from './lib/Utils';
