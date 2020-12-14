import { Logs } from '@tensorflow/tfjs-node';
declare type SSLine = {
    m: number;
    b: number;
};
/**
 * Manages the training statistics for one model. TensorFlow produces stats each
 * epoch. This class records them, and maintains trailing averages to smooth
 * spikes and dips. It calculates deltas and slopes for these averages. This
 * information can be used to detect problematic situations such as overfitting.
 * EpochStats also has text helpers for logging and output as CSV.
 */
declare class EpochStats {
    private _trailDepth;
    private _samplesAccuracy;
    private _samplesLoss;
    private _samplesValidationAccuracy;
    private _samplesValidationLoss;
    private _averageAccuracy;
    private _averageLoss;
    private _averageLossDelta;
    private _averageValidationAccuracy;
    private _averageValidationLoss;
    private _lineAccuracy;
    private _lineLoss;
    private _lineValidationAccuracy;
    private _lineValidationLoss;
    /**
     * Creates an instance of EpochStats.
     * @param {number} _trailDepth Total samples in a (simple) trailing average.
     */
    constructor(_trailDepth: number);
    get averageAccuracy(): number;
    get averageLoss(): number;
    get averageValidationAccuracy(): number;
    get averageValidationLoss(): number;
    get lineAccuracy(): SSLine;
    get lineLoss(): SSLine;
    get lineValidationAccuracy(): SSLine;
    get lineValidationLoss(): SSLine;
    /**
     * Takes the results of an epoch, and updates the trailing averages, deltas
     * and slopes.
     * @param {number} epoch Iteration count from model fit; currently unused.
     * @param {Logs} logs A TensorFlow object with the latest values for
     *					  accuracy, loss, validation-accuracy and
     *					  validation-loss.
     */
    Update(epoch: number, logs: Logs): void;
    WriteCSVLineKeys(): string;
    WriteCSVLineValues(): string;
    /**
     * Generates a one-line text report with the following:
     * <ul>
     *   <li>all of the trailing averages</li>
     *   <li>the slope of each average (accuracy, loss, validation-accuracy and validation-loss)</li>
     *   <li>relevant deltas between the training and validation values</li>
     * <ul>
     * @return {string}
     */
    WriteReport(): string;
    /**
     * Gets the header that goes with {@link WriteReport}.
     * @static
     * @return {string}
     */
    static WriteReportHeader(): string;
}
export { EpochStats };
