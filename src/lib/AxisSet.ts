'use strict';


//NOTE: TODO: Due to a redesign, this level isn't needed. We can simply pass an
//			  into Grid's constructor.
//			  The pass-throughs are dropped, and the helpers become methods of
//			  AxisSetTraverser.
//			  Good effort, though.
//
//    UPDATE: This is pending the implementation of Schedules/Recipes, which
//			  are alternate methods of defining the grid. This may play a role
//			  after all.


import { StringKeyedNullsObject, StringKeyedNumbersObject } from './types';


import { Axis } from './Axis';


/**
 * Manages a collection of {@link Axis}.
 */
class AxisSet {
	/**
	 * Creates an instance of AxisSet.
	 * @param {Array<Axis>} _axes An array of {@link Axis}. Each axis must have a unique hyperparameter.
	 */
	constructor(private _axes: Array<Axis>) {
		// validate the incoming axes

		const AXES_BY_TYPE: StringKeyedNullsObject = {};

		this._axes.forEach((axis) => {
			// no duplicates
			if (AXES_BY_TYPE[axis.type] !== undefined) {
				throw new Error('Duplicate axis found: ' + axis.typeName);
			}

			AXES_BY_TYPE[axis.type] = null;
		});
	}

	/**
	 * Pass-through to advance an axis.
	 * @param {number} index The axis to advance.
	 */
	AdvanceAxis(index: number): void {
		this.ValidateIndex(index);

		this._axes[index].Advance();
	}

	/**
	 * Pass-through to check completion.
	 * @param {number} index The axis to check.
	 * @return {boolean}
	 */
	CheckAxisComplete(index: number): boolean {
		this.ValidateIndex(index);

		return this._axes[index].CheckComplete();
	}

	/**
	 * Builds a simple map in the format "{ axis0-name: axis0-value, ... }"
	 * @return {StringKeyedNumbersObject}
	 */
	CreateParams(): StringKeyedNumbersObject {
		const PARAMS: StringKeyedNumbersObject = {};

		for (let i = 0; i < this._axes.length; ++i) {
			const AXIS = this._axes[i];

			PARAMS[AXIS.typeName] = AXIS.CalculatePosition();
		}

		return PARAMS;
	}

	/**
	 * Gets the collection size.
	 * @return {number}
	 */
	GetTotalAxes(): number {
		return this._axes.length;
	}

	/**
	 * Pass-through to reset an axis.
	 * @param {number} index The axis to reset.
	 */
	ResetAxis(index: number): void {
		this.ValidateIndex(index);

		this._axes[index].Reset();
	}

	/**
	 * Fails if an axis index is out-of-bounds.
	 * @param {number} index The axis index to validate.
	 */
	ValidateIndex(index: number): void {
		console.assert(index >= 0);
		console.assert(index < this._axes.length);
	}

	/**
	 * Traverses the axis collection, invoking a callback for each.
	 * @param {function(Axis): void} callback The function to be invoked with an instance of {@link Axis}.
	 */
	Walk(callback: CallbackDoSomethingWithAxis): void {
		this._axes.forEach(callback);
	}

	/**
	 * Pass-through to get axis reports.
	 * @param {number} index The axis to report.
	 * @param {boolean} compact Whether to get a detailed report.
	 * @return {string}
	 */
	WriteAxisReport(index: number, compact: boolean): string {
		this.ValidateIndex(index);

		return this._axes[index].WriteReport(compact);
	}
}


//NOTE: This is only here for JSDoc, which has a hard time parsing the
//		signature. It's not hurting anyone. Yet.
type CallbackDoSomethingWithAxis = (axis: Axis) => void;


Object.freeze(AxisSet);

export { AxisSet };
