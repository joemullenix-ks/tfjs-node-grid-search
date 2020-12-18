'use strict';


import * as Types from './types';


import * as Utils from './Utils';


/**
 * Merges two sets of params, dynamic and static, that will be used to create
 * a network model.
 */
class ModelParams {
	private _mergedParams: Types.StringKeyedSimpleObject = {};

	/**
	 * Creates an instance of ModelParams.
	 * @param {Types.StringKeyedSimpleObject} _dynamicParams
	 * @param {Types.StringKeyedSimpleObject} _staticParams
	 */
	constructor(private _dynamicParams: Types.StringKeyedSimpleObject,
				private _staticParams: Types.StringKeyedSimpleObject) {
		// start off with a (shallow) clone of the statics...
		this._mergedParams = Object.assign({}, this._staticParams);

		// ...then merge in the dynamics, throwing in the event of a collision
		for (const k in this._dynamicParams) {
			if (this._mergedParams[k] !== undefined) {
				throw new Error('Merging model params with a dynamic-static collision (these are mutually exclusive); key: ' + k);
			}

			this._mergedParams[k] = this._dynamicParams[k];
		}
	}

	/**
	 * Retrieve a Boolean param's value.
	 * @param {string} key
	 * @return {boolean}
	 */
	GetBooleanParam(key: string): boolean {
		this.ValidateParamKey(key);

		if (typeof this._mergedParams[key] !== 'boolean') {
			throw new Error('param ' + key + ' is not Boolean: ' + this._mergedParams[key]);
		}

		return Boolean(this._mergedParams[key]);
	}

	/**
	 * Retrieve a number param's value.
	 * @param {string} key
	 * @return {number}
	 */
	GetNumericParam(key: string): number {
		this.ValidateParamKey(key);

		if (typeof this._mergedParams[key] !== 'number') {
			throw new Error('param ' + key + ' is not a number: ' + this._mergedParams[key]);
		}

		return Number(this._mergedParams[key]);
	}

	/**
	 * Retrieve a string param's value.
	 * @param {string} key
	 * @return {string}
	 */
	GetTextParam(key: string): string {
		this.ValidateParamKey(key);

		if (typeof this._mergedParams[key] !== 'string') {
			throw new Error('param ' + key + ' is not a string: ' + this._mergedParams[key]);
		}

		return String(this._mergedParams[key]);
	}

	/**
	 * Throws if a param key is not supported. This is exceptional because the
	 * objects our constructor takes are not user input. They've been processed.
	 * @private
	 * @param {string} key
	 */
	private ValidateParamKey(key: string): void {
		Utils.Assert(key !== '');

		if (this._mergedParams[key] === undefined) {
			throw new Error('ModelParams key not found: ' + key);
		}
	}

//vv TODO: These move into a CSVSource interface
	WriteCSVLineKeys(): string {
		let textOut = '';

		for (const k in this._mergedParams) {
			textOut += k + ',';
		}

		// drop the trailing comma
		textOut = textOut.slice(0, -1);

		return textOut;
	}

	WriteCSVLineValues(): string {
		let textOut = '';

		for (const k in this._mergedParams) {
			// check every string for file-breakers, while we're here

//PERF: This is potentially overkill (we validate these early on in their lifecycle).
//		I'm keeping it because that initial validation is not done w/ CSV writes in mind. It's much more focused
//		on proper uint/bool/string.
//		Redundancy is good, but if our file writes become perceptibly slower, this can go.
			Utils.ValidateTextForCSV(this._mergedParams[k]);

			textOut += this._mergedParams[k] + ',';
		}

		// drop the trailing comma
		textOut = textOut.slice(0, -1);

		return textOut;
	}
//^^
}


Object.freeze(ModelParams);

export { ModelParams };
