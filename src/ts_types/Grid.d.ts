
//NOTE: TensorFlow's Tensor classes go up to six, thus these defines. If you need seven, by all means extend.
//
//NOTE: We're leaving out the 1d (flat) variant, but that may not hold up. It's done to fix a gnarly
//		problem when I need to pass a single proof-case, e.g. evaluate(tfarray[i]). If that array is
//		flat, then the entry is a number, which is no longer compatible w/ TFNestedArray.
//		This will fall to my pre-NPM QA.
//
//TODO: ...all of this to say we're likely not doing nested arrays correctly; gotta be a flexible, dynamic
//		solution. Hint: read up on Array<...>.
//
//type ArrayOrder1 = Array<number>;
type ArrayOrder2 = Array<Array<number>>;
type ArrayOrder3 = Array<Array<Array<number>>>;
type ArrayOrder4 = Array<Array<Array<Array<number>>>>;
type ArrayOrder5 = Array<Array<Array<Array<Array<number>>>>>;
type ArrayOrder6 = Array<Array<Array<Array<Array<Array<number>>>>>>;

export type TFNestedArray = ArrayOrder1 | ArrayOrder2 | ArrayOrder3 | ArrayOrder4 | ArrayOrder5 | ArrayOrder6;


export type CallbackEvaluatePrediction = (	target: TFNestedArray,
											prediction: TFNestedArray) => PredictionEvaluation;

export type CallbackReportBatch = (	duration: number,
									batch,
									logs) => void;

export type CallbackReportEpoch = (	duration: number,
									epoch: number,
									logs,
									epochStats: typeof EpochStats) => void;

export type CallbackReportIteration = (	duration: number,
										predictions: TFNestedArray,
										proofInputs: TFNestedArray,
										proofTargets: TFNestedArray) => void;
