declare class PredictionEvaluation {
    private _correct;
    private _delta;
    constructor(_correct: boolean, _delta: number);
    get correct(): boolean;
    get delta(): number;
}
export { PredictionEvaluation };
