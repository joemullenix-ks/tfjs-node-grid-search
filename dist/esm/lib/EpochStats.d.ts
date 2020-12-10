import { Logs } from '@tensorflow/tfjs-node';
declare type SSLine = {
    m: number;
    b: number;
};
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
    constructor(_trailDepth: number);
    get averageAccuracy(): number;
    get averageLoss(): number;
    get averageValidationAccuracy(): number;
    get averageValidationLoss(): number;
    get lineAccuracy(): SSLine;
    get lineLoss(): SSLine;
    get lineValidationAccuracy(): SSLine;
    get lineValidationLoss(): SSLine;
    Update(epoch: number, logs: Logs): void;
    WriteCSVLineKeys(): string;
    WriteCSVLineValues(): string;
    WriteReport(): string;
    static WriteReportHeader(): string;
}
export { EpochStats };
