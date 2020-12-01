declare abstract class Progression {
    private _integerBased;
    private _typeName;
    protected _value: number;
    constructor(_integerBased: boolean, // "integerBased" as opposed to floating point
    _typeName: string);
    get integerBased(): boolean;
    get typeName(): string;
    get value(): number;
    Reset(): void;
    abstract Advance(): void;
}
export { Progression };
