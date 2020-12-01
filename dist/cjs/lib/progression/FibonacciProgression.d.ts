import { Progression } from '../Progression';
declare class FibonacciProgression extends Progression {
    private _initiator;
    private _fiboA;
    private _fiboB;
    private _initFiboA;
    private _initFiboB;
    constructor(_initiator: number);
    Advance(): void;
    Reset(): void;
    ResetFibonacciInputs(): void;
}
export { FibonacciProgression };
