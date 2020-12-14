'use strict';


import { ArrayOrder2, TFNestedArray } from './types';


/**
 * The inputs and targets that will be used to train and test network models.
 */
class DataSet {
	/**
	 * Creates an instance of DataSet.
	 * @param {TFNestedArray} _inputs The cases that will be sent to TF's model
	 * 								  fit(). The values must be nested arrays,
	 *								  because they will become TF tensors. See
	 *								  {@link https://js.tensorflow.org/api/latest/#tensor}
	 *								  for details. Note that the flat-array
	 *								  option is not yet supported.
	 * @param {ArrayOrder2} _targets The output values associated with the
	 *								 input data. Must be a two-dimensional
	 *								 nested array. Note: Proper format
	 *								 flexibility is coming soon!
	 * @example
	 * // create a data set with inputs and targets for three cases
	 * new tngs.DataSet([[ 0, 2, 0, 4 ], [ 9, 2, 9, 6 ], [ 3, 5, 7, 1 ]],
	 *                  [[ 1, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, 1 ]]);
	 *
	 * // In this data, there are four inputs for each case. The targets are
	 * // one-hot classification probabilities, labeled "even", "mixed" and
	 * // "odd".
	 */
	constructor(private _inputs: TFNestedArray, private _targets: ArrayOrder2) {
		console.assert(this._inputs.length > 0);

		if (this._inputs.length !== this._targets.length) {
			throw new Error('Data invalid. The number of inputs ('
							+ this._inputs.length + ') does not match the '
							+ 'number of targets (' + this._targets.length
							+ ') .');
		}
	}

	get inputs(): TFNestedArray { return this._inputs; }
	get targets(): ArrayOrder2 { return this._targets; }
}


Object.freeze(DataSet);

export { DataSet };
