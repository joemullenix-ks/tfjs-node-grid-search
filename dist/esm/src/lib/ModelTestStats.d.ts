/**
 * Gathers the scores (right/wrong and accuracy delta) for a model run. These
 * are determined via callback, during the search iteration's testing phase.
 */
declare class ModelTestStats {
    private _deltaCorrect;
    private _deltaIncorrect;
    private _totalCorrect;
    private _totalCases;
    /**
     * Creates an instance of ModelTestStats.
     * @param {number} _deltaCorrect Aggregate accuracy deltas for the cases
     *	with 'correct' predictions.
     * @param {number} _deltaIncorrect Aggregate accuracy deltas for the cases
     *	with 'incorrect' predictions.
     * @param {number} _totalCorrect Sum of cases with 'correct' predictions.
     * @param {number} _totalCases Sum of cases used to test (aka proof cases).
     */
    constructor(_deltaCorrect: number, _deltaIncorrect: number, _totalCorrect: number, _totalCases: number);
    /**
     * Gets correct / total.
     * @return {number}
     */
    CalculateScore(): number;
    WriteCSVLineKeys(): string;
    WriteCSVLineValues(): string;
}
export { ModelTestStats };
