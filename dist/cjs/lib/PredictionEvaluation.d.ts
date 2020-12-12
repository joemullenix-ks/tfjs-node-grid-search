/**
 * Container for the right/wrong score of a generalization case, as well as an
 * arbitrary, user-defined delta. The delta is intended for accuracy/quality
 * ratings.
 */
declare class PredictionEvaluation {
    private _correct;
    private _delta;
    /**
     * Creates an instance of PredictionEvaluation.
     * @param {boolean} _correct Whether the prediction is acceptable.
     * @param {number} _delta The accuracy or quality of the prediction.
     */
    constructor(_correct: boolean, _delta: number);
    get correct(): boolean;
    get delta(): number;
}
export { PredictionEvaluation };
