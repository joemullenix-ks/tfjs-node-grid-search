import { Progression } from '../Progression';
declare class ExponentialProgression extends Progression {
    private _exponent;
    private _scale;
    private _step;
    constructor(exponent: number, scale: number);
    Advance(): void;
    Reset(): void;
    ResetStep(): void;
}
export { ExponentialProgression };
