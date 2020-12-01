declare class ModelTestStats {
    private _deltaCorrect;
    private _deltaIncorrect;
    private _totalCorrect;
    private _totalCases;
    constructor(_deltaCorrect: number, _deltaIncorrect: number, _totalCorrect: number, _totalCases: number);
    CalculateScore(): number;
    WriteCSVLineKeys(): string;
    WriteCSVLineValues(): string;
}
export { ModelTestStats };
