import { IterationResult } from './IterationResult';
declare class GridRunStats {
    private _iterationResults;
    constructor();
    AddIterationResult(iterationResult: IterationResult): void;
    WriteCSV(): string;
    WriteReport(sortByScore: boolean): string;
}
export { GridRunStats };
