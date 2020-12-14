/**
 * Simple class for retrieving details/info/instructions from a failed check.
 */
declare class FailureMessage {
    private _text;
    /**
    * Creates an instance of FailureMessage.
    */
    constructor();
    get text(): string;
    set text(text: string);
}
export { FailureMessage };
