'use strict';


import { ArrayOrder2, TFNestedArray } from './types';


class DataSet {
	constructor(private _inputs: TFNestedArray, private _targets: ArrayOrder2) {
		console.assert(this._inputs.length > 0);
		console.assert(this._inputs.length === this._targets.length);
	}

	get inputs(): TFNestedArray { return this._inputs; }
	get targets(): ArrayOrder2 { return this._targets; }
}


Object.freeze(DataSet);

export { DataSet };
