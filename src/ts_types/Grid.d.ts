
export type CallbackEvaluatePrediction = (	target: Array<number>,
											prediction: Array<number>) => object;

//[[TF ANY]]
export type CallbackReportBatch = (	duration: bigint,
									batch: any,
									logs: any) => void;

//[[TF ANY]]
export type CallbackReportEpoch = (	duration: bigint,
									epoch: number,
									logs: any,
									epochStats: typeof EpochStats) => void;

export type CallbackReportIteration = (	duration: bigint,
										predictions: Array<number>,
										proofInputs: TFInputsArray,
										proofTargets: Array<number>) => void;
