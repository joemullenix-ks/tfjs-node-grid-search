import { EpochStats } from './EpochStats';
import { ModelParams } from './ModelParams';
import { ModelTestStats } from './ModelTestStats';
declare class IterationResult {
    private _iteration;
    private _descriptor;
    private _epochStats;
    private _modelParams;
    private _modelTestStats;
    private _repetition;
    private _runDuration;
    private _score;
    constructor(_iteration: number, _descriptor: string, _epochStats: EpochStats, _modelParams: ModelParams, _modelTestStats: ModelTestStats, _repetition: number, _runDuration: number);
    get iteration(): number;
    get repetition(): number;
    get runDuration(): number;
    get score(): number;
    WriteEpochStatsHeader(): string;
    WriteEpochStatsValues(): string;
    WriteModelParamHeader(): string;
    WriteModelParamValues(): string;
    WriteTestStatsHeader(): string;
    WriteTestStatsValues(): string;
    WriteReport(): string;
}
export { IterationResult };
