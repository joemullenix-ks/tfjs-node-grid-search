'use strict';


import { PredictionEvaluation } from '../lib/PredictionEvaluation'


//TODO: I am not at all satisfied with this array typing, specifically the "Array<unknown>" cop-out.
//		TypeScript is perfectly happy with the 'array stack' union, but ESLint is not. I tried a few templated,
//		generic and/or recursive approaches, with varying degrees of success, but nothing clean enough.
//
//		The next approach will use TF's built in types (e.g. TensorLike). See: ModelStatics.ts


//NOTE: TensorFlow's Tensor classes go up to six, thus these defines. If you need seven, by all means extend.
type ArrayOrder1 = Array<number>;
type ArrayOrder2 = Array<Array<number>>;
type ArrayOrder3 = Array<Array<Array<number>>>;
type ArrayOrder4 = Array<Array<Array<Array<number>>>>;
type ArrayOrder5 = Array<Array<Array<Array<Array<number>>>>>;
type ArrayOrder6 = Array<Array<Array<Array<Array<Array<number>>>>>>;

export type TFArrayStack = ArrayOrder1 | ArrayOrder2 | ArrayOrder3 | ArrayOrder4 | ArrayOrder5 | ArrayOrder6;

export type TFCase = ArrayOrder1 | ArrayOrder2 | ArrayOrder3 | ArrayOrder4 | ArrayOrder5;

export type TFNestedArray = Array<unknown>;

export type CallbackEvaluatePrediction = (	target: ArrayOrder1,
											prediction: ArrayOrder1) => PredictionEvaluation;

export type CallbackReportBatch = (	duration: number,
									batch,
									logs) => void;

export type CallbackReportEpoch = (	duration: number,
									epoch: number,
									logs,
									epochStats: typeof EpochStats) => void;

export type CallbackReportIteration = (	duration: number,
										predictions: ArrayOrder2,
										proofInputs: TFNestedArray,
										proofTargets: ArrayOrder2) => void;
