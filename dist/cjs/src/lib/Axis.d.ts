/**
 * @module Axis
 */
import { StringKeyedNumbersObject, StringKeyedStringsObject } from './types';
import { FailureMessage } from './FailureMessage';
import { Progression } from './progression/Progression';
/**
 * Manages one hyperparameter over the course of the search.
 * It uses a bounded range, and a progression across that range, to define
 * a set of steps. A model is trained and tested at each step.
 * Positions along the axis are defined as the sum of _boundBegin and
 * _progression's current value. When this sum is greather than _boundEnd,
 * the axis is complete.
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
    * @param {number} _typeEnum The hyperparameter associated with this axis.
    *							Must be a member of the [AxisTypes]{@link Axis.AxisTypes} enum.
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
    */
    Advance(): void;
    /**
     * Gets the current value of this axis, defined as (_boundBegin +
     * _progression.value).
     * @return {number} The hyperparameter's value in the active model.
     */
    CalculatePosition(): number;
    /**
     * Determines whether this axis is at or beyond the end of its range.
     * @return {boolean}
     */
    CheckComplete(): boolean;
    /**
     * Moves the progression to its initial position.
     */
    Reset(): void;
    /**
    * Gets a description of the axis's type and position. Set 'compact' to false
    * for details on the progression.
    * @param {boolean} compact If false, bounds and progression are included.
    * @return {string}
    */
    WriteReport(compact: boolean): string;
    /**
     * Checks whether a begin/end boundary is valid for a given hyperparameter.
     * Writes an informative message for the user, in the event of failure.
     * @static
     * @param {string} key Must match an entry in the [AxisNames]{@link Axis.AxisNames} enum.
     * @param {number} value The number to validated against this hyperparameter.
     * @param {FailureMessage} failureMessage Explanatory faliure text is written to this object.
     * @return {boolean}
     */
    static AttemptValidateParameter(key: string, value: number, failureMessage: FailureMessage): boolean;
    /**
     * Checks whether a progression's config is valid for a given hyperparameter.
     * Writes an informative message for the user, in the event of failure.
     * @static
     * @param {string} key Must match an entry in the [AxisNames]{@link Axis.AxisNames} enum.
     * @param {Progression} progression A concrete instance derived from Progression.
     * @param {FailureMessage} failureMessage Explanatory faliure text is written to this object.

     * @return {boolean}
     */
    static AttemptValidateProgression(key: string, progression: Progression, failureMessage: FailureMessage): boolean;
    /**
     * Takes an entry from the [AxisTypes]{@link Axis.AxisTypes} enum, and return its associated name.
     * @static
     * @param {number} type An entry from the [AxisTypes]{@link Axis.AxisTypes} enum.
     * @return {string} An entry from the [AxisNames]{@link Axis.AxisNames} enum.
     */
    static LookupTypeName(type: number): string;
}
/**
 * Enumeration of the hyperparameter default values.<br>
 * See [AxisTypes]{@link Axis.AxisTypes} for details on each hyperparameter.
 * @enum {number}
 * @memberof Axis
 */
declare const AxisDefaults: StringKeyedNumbersObject;
/**
 * Enumeration of the hyperparameter names.<br>
 * See [AxisTypes]{@link Axis.AxisTypes} for details on each hyperparameter.
 * @enum {string}
 * @memberof Axis
 */
declare const AxisNames: StringKeyedStringsObject;
/**
 * Enumeration of the hyperparameters currently supported in TNGS.
 * @enum {number}
 * @memberof Axis
 */
declare const AxisTypes: StringKeyedNumbersObject;
export { Axis, AxisDefaults, AxisNames, AxisTypes };
