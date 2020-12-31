'use strict';
// console.log(process.version.split('.'));
// console.log(process.version.split('.')[0].split('v')[1]);
// console.log(typeof process.version.split('.')[0].split('v')[1]);
const NODE_VERSION_MAJOR = Number(process.version.split('.')[0].split('v')[1]);
if (NODE_VERSION_MAJOR < 14) {
    console.warn('TNGS is designed for Node versions 14+.');
}
else {
    console.warn('Node version looks good: ' + NODE_VERSION_MAJOR);
}
/**
 * tfjs-node-grid-search
 * @module main
 */
export * from './lib/types';
//TDOO: Axis becomes abstract with subs, eliminating the enums
export { Axis, AxisDefaults, AxisNames, AxisTypes } from './lib/Axis';
export { AxisSet } from './lib/AxisSet';
export { AxisSetTraverser } from './lib/AxisSetTraverser';
export { DataSet } from './lib/DataSet';
export { DataSetFetcher } from './lib/DataSetFetcher';
export { EpochStats } from './lib/EpochStats';
export { FailureMessage } from './lib/FailureMessage';
export * as FileIO from './lib/FileIO';
export { FileIOResult } from './lib/FileIOResult';
export { Grid } from './lib/Grid';
export { GridOptions } from './lib/GridOptions';
export { GridRunStats } from './lib/GridRunStats';
export { IterationResult } from './lib/IterationResult';
export { ModelParams } from './lib/ModelParams';
export { ModelStatics } from './lib/ModelStatics';
export { ModelTestStats } from './lib/ModelTestStats';
export { PredictionEvaluation } from './lib/PredictionEvaluation';
export { Progression } from './lib/progression/Progression';
export { ExponentialProgression } from './lib/progression/ExponentialProgression';
export { FibonacciProgression } from './lib/progression/FibonacciProgression';
export { LinearProgression } from './lib/progression/LinearProgression';
export { SessionData } from './lib/SessionData';
export * as Utils from './lib/Utils';
//# sourceMappingURL=main.js.map