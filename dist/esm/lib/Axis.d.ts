import { FailureMessage } from './FailureMessage';
import { Progression } from './Progression';
/**
 * Axis manages one hyperparameter over the course of the search.<br>
 * It uses a bounded range, and a progression across that range, to define<br>
 * a set of steps. A model is trained and tested at each step.<br>
 * The position along the axis is calculated as the sum of _boundBegin<br>
 * and _progression's current value. When this sum is greather than _boundEnd,
 * the axis is complete.<br>
 * @example
 * // create an axis for the hyperparameter 'batch size', with a range of {8, 12, 16}
 * new tngs.Axis(tngs.AxisTypes.BATCH_SIZE,
 *               8,
 *               16,
 *               new tngs.LinearProgression(4))
 */
declare class Axis {
    private _typeEnum;
    private _boundBegin;
    private _boundEnd;
    private _progression;
    private _forward;
    private _typeName;
    /**
    * Creates an instance of Axis.
    * @param {number} _typeEnum The parameter to manage. @see Types
    * @param {number} _boundBegin The start of the search range, inclusive.
    * @param {number} _boundEnd The end of the search range, inclusive.
    * @param {Progression} _progression Provides a set of offsets used to
    *									determine the steps in the range.
    */
    constructor(_typeEnum: number, _boundBegin: number, _boundEnd: number, _progression: Progression);
    get type(): number;
    get typeName(): string;
    /**
    * Moves the progression to its next position.
    * @memberof Axis
    */
    Advance(): void;
    /**
     * Returns the current value of this axis, defined as (_boundBegin +<br>
     * _progression.value).
     * @return {number} The hyperparameter's value in the active model.
     * @memberof Axis
     */
    CalculatePosition(): number;
    /**
     * Determines whether this axis is at or beyond the end of its range.
     * @return {boolean}
     * @memberof Axis
     */
    CheckComplete(): boolean;
    /**
     * Moves the progression to its initial position.
     * @memberof Axis
     */
    Reset(): void;
    /**
    * Gets a compact or verbose description of the progression's position.
    * @param {boolean} compact
    * @return {*}  {string}
    * @memberof Axis
    */
    WriteReport(compact: boolean): string;
    /**
     * Checks a begin/end boundary for invalid or incompatible parameters with
     * respect to its hyperparameter. Writes an informative message for the
     * user, in the event of failure.
     * @static
     * @param {string} key
     * @param {number} value
     * @param {FailureMessage} failureMessage
     * @return {*}  {boolean}
     * @memberof Axis
     */
    static AttemptValidateParameter(key: string, value: number, failureMessage: FailureMessage): boolean;
    /**
     * Checks a progression for invalid or incompatible parameters with respect
     * to its hyperparameter. Writes an informative message for the user, in
     * the event of failure.
     * @static
     * @param {string} key
     * @param {Progression} progression
     * @param {FailureMessage} failureMessage
     * @return {boolean}
     * @memberof Axis
     */
    static AttemptValidateProgression(key: string, progression: Progression, failureMessage: FailureMessage): boolean;
    /**
     * Takes an entry from the Types enum, and return its associated name.
     * @static
     * @param {number} type An entry from the Types enum.
     * @return {string} An entry from the Names enum.
     * @memberof Axis
     */
    static LookupTypeName(type: number): string;
}
declare enum Defaults {
    BATCH_SIZE = 10,
    EPOCHS = 50,
    LAYERS = 2,
    LEARN_RATE = 0.001,
    NEURONS = 16,
    VALIDATION_SPLIT = 0.2
}
declare enum Names {
    BATCH_SIZE = "batchSize",
    EPOCHS = "epochs",
    LAYERS = "hiddenLayers",
    LEARN_RATE = "learnRate",
    NEURONS = "neuronsPerHiddenLayer",
    VALIDATION_SPLIT = "validationSplit"
}
declare enum Types {
    BATCH_SIZE = 0,
    EPOCHS = 1,
    LAYERS = 2,
    LEARN_RATE = 3,
    NEURONS = 4,
    VALIDATION_SPLIT = 5,
    _TOTAL = 6
}
export { Axis, Defaults, Names, Types };
