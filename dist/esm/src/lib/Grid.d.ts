import * as TENSOR_FLOW from '@tensorflow/tfjs-node';
import * as Types from './types';
import { AxisSet } from './AxisSet';
import { EpochStats } from './EpochStats';
import { GridOptions } from './GridOptions';
import { ModelStatics } from './ModelStatics';
import { PredictionEvaluation } from './PredictionEvaluation';
import { SessionData } from './SessionData';
/**
 * Performs the grid search.<br>
 * Grid takes the data set, static params, dynamic params (axes), and a set of
 * options. It also takes a callback that lets the user 'score' each model.<br>
 * There are optional callbacks that give the user updates over the course
 * of the search. You may send handlers for end-of-batch, end-of-epoch
 * and end-of-iteration (<i>iteration</i> meaning one model's train and test
 * sequence).
 */
declare class Grid {
    private _modelStatics;
    private _sessionData;
    private _callbackEvaluatePrediction;
    private _userGridOptions?;
    private _callbackReportIteration?;
    private _callbackReportEpoch?;
    private _callbackReportBatch?;
    private _axisSetTraverser;
    private _epochStats;
    private _gridOptions;
    private _timeStartBatch;
    private _timeStartEpoch;
    private _timeStartGrid;
    private _timeStartIteration;
    /**
     * Creates an instance of Grid.
     * @param {AxisSet} axisSet The hyperparameter ranges to search.
     * @param {ModelStatics} _modelStatics The parameters that will be the same
     *	for every model.
     * @param {SessionData} _sessionData The data set to be used for training
     *	and testing each model.
     * @param {function} _callbackEvaluatePrediction
     *	A function which takes a prediction for a case's inputs, and that case's
     *	actual targets. The function returns a score for the prediction.
     *	These scores determine the 'quality' of each model.<br>
     *  <b>Arguments:</b> target: number[], prediction: number[]<br>
     *  <b>Returns:</b> {@link PredictionEvaluation}
     * @param {GridOptions} [_userGridOptions] Settings for the search.
     * @param {function} [_callbackReportIteration] A function
     *	invoked at the end of every model's train-and-test sequence.<br>
     *  <b>Arguments:</b> duration: number, predictions: number[][], proofInputs: Array<unknown>, proofTargets: number[][]<br>
     *  <b>Returns:</b> void
     * @param {function} [_callbackReportEpoch] A function invoked
     *	at the end of every training epoch. If this is not included (i.e. it's
     *	null or undefined), default reporting will be logged every epoch. See
     *	{@link EpochStats#WriteReport} for the default report's format.<br>
     *  <b>Arguments:</b> duration: number, epoch: number, logs: tf.Logs, epochStats: {@link EpochStats}<br>
     *  <b>Returns:</b> void
     * @param {function} [_callbackReportBatch] A function invoked
     *	at the end of every train epoch. Note that this can get <i>very</i>
     *	spammy!<br>
     *  <b>Arguments:</b> duration: number, predictions: number[][], proofInputs: Array<unknown>, proofTargets: number[][]<br>
     *  <b>Returns:</b> void
     * @example
     * // Sample CallbackEvaluatePrediction
     * function EvaluatePrediction(target: number[], prediction: number[]) {
     *   // your logic here; determine whether the prediction is correct
     *
     *   return new tngs.PredictionEvaluation(correct);
     * }
     */
    constructor(axisSet: AxisSet, _modelStatics: ModelStatics, _sessionData: SessionData, _callbackEvaluatePrediction: CallbackEvaluatePrediction, _userGridOptions?: GridOptions | undefined, _callbackReportIteration?: CallbackReportIteration | undefined, _callbackReportEpoch?: CallbackReportEpoch | undefined, _callbackReportBatch?: CallbackReportBatch | undefined);
    /**
     * Produces a compiled instance of TF's Sequential model, ready to train.
     * @private
     * @param {ModelParams} modelParams The config of the model to create.
     * @return {TENSOR_FLOW.Sequential}
     */
    private CreateModel;
    /**
     * Clears the stats tracker from the last iteration, and creates a new one.
     * @private
     */
    private ResetEpochStats;
    /**
     * Begins the grid search. Async for the TF model.fit() {@link https://js.tensorflow.org/api/latest/#tf.Sequential.fit}
     * @return {Promise<void>}
     */
    Run(): Promise<void>;
    /**
     * Merges the static and dynamic model hyperparameters, warning in the event
     * of collision. If any param is set as both static and dynamic (i.e. it's
     * included in {@link ModelStatics} and it has an {@link Axis}), the
     * dynamic values are used.
     * @private
     */
    private ResolveModelDefinition;
    /**
     * Runs generalization tests on a model, to determine its 'quality'.<br>
     * A portion of the data set is reserved; never used in training. This is
     * called the "proof set". After a model has been trained, it's used to
     * make a prediction for each case in the proof set. The user provides an
     * accuracy score for each prediction via callback.
     * @private
     * @param {TENSOR_FLOW.Sequential} model The trained model to test.
     * @param {ModelParams} modelParams The config used to create the model.
     * @param {number} duration The duration of the training process.
     * @return {ModelTestStats}
     */
    private TestModel;
    /**
     * Runs model.fit() using the training data, tracks stats and invokes the
     * optional reporting callbacks.
     * @private
     * @param {TENSOR_FLOW.Sequential} model A compiled model to train.
     * @param {ModelParams} modelParams The config used to create the model.
     * @return {Promise<void>}
     */
    private TrainModel;
}
declare type CallbackEvaluatePrediction = (target: Types.ArrayOrder1, prediction: Types.ArrayOrder1) => PredictionEvaluation;
declare type CallbackReportBatch = (duration: number, batch: number, logs: TENSOR_FLOW.Logs | undefined) => void;
declare type CallbackReportEpoch = (duration: number, epoch: number, logs: TENSOR_FLOW.Logs | undefined, epochStats: EpochStats) => void;
declare type CallbackReportIteration = (duration: number, predictions: Types.ArrayOrder2, proofInputs: Types.TFNestedArray, proofTargets: Types.ArrayOrder2) => void;
export { Grid };
