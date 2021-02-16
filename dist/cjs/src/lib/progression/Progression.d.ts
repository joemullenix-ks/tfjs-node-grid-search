/**
 * Abstract base of the Progression classes.
 * @abstract
 */
declare abstract class Progression {
    private _integerBased;
    private _typeName;
    protected _value: number;
    /**
     * Creates an instance of Progression.
     * @param {boolean} _integerBased Send 'true' if this progression uses
     *                                integer steps exclusively (as opposed to
     *                                floating-point).
     * @param {string} _typeName A simple label for logging.
     */
    constructor(_integerBased: boolean, // "integerBased" as opposed to floating point
    _typeName: string);
    get integerBased(): boolean;
    get typeName(): string;
    get value(): number;
    /**
     * Puts the progression in its initial state (_value = 0).
     */
    Reset(): void;
    abstract Advance(): void;
}
export { Progression };
