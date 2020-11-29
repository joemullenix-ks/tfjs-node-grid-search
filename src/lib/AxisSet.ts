'use strict';


import { StringKeyedNullsObject, StringKeyedNumbersObject } from '../ts_types/common';


import { Axis } from './Axis';


class AxisSet {
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

	AdvanceAxis(index: number): void {
		this.ValidateIndex(index);

		this._axes[index].Advance();
	}

	CheckAxisComplete(index: number): boolean {
		this.ValidateIndex(index);

		return this._axes[index].CheckComplete();
	}

	CreateParams(): StringKeyedNumbersObject {
		const PARAMS: StringKeyedNumbersObject = {};

		for (let i = 0; i < this._axes.length; ++i) {
			const AXIS = this._axes[i];

//TODO: Should we do these by index or key?? This isn't particularly perf-intensive, and keys are much friendlier
//		to write and debug.
//		This will be revisited when I implement minification.
			PARAMS[AXIS.typeName] = AXIS.CalculatePosition();
		}

		return PARAMS;
	}

	GetTotalAxes(): number {
		return this._axes.length;
	}

	ResetAxis(index: number): void {
		this.ValidateIndex(index);

		this._axes[index].Reset();
	}

	ValidateIndex(index: number): void {
		console.assert(index >= 0);
		console.assert(index < this._axes.length);
	}

	Walk(callback: (axis: Axis) => void): void {
		this._axes.forEach(callback);
	}

	WriteAxisReport(index: number, compact: boolean): string {
		this.ValidateIndex(index);

		return this._axes[index].WriteReport(compact);
	}
}


Object.freeze(AxisSet);

export { AxisSet };
