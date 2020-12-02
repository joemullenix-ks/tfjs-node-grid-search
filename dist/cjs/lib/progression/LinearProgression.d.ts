import { Progression } from '../Progression';
declare class LinearProgression extends Progression {
    private _step;
    constructor(step: number);
    Advance(): void;
}
export { LinearProgression };
