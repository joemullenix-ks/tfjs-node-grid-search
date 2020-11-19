'use strict';


import { Utils } from './Utils';


//NOTE: TODO: Should this be lifted out into a d.ts file?
//			  If so, should it go into custom (which should be "_common" or "Common" or such as)
type StringKeyedSimpleObject = { [key: string]: string | number | boolean; };
// export type StringKeyedSimpleObject = { [key: string]: string | number | boolean; };


class ModelParams {
	private _mergedParams: StringKeyedSimpleObject = {};

	constructor(private _dynamicParams: StringKeyedSimpleObject,
				private _staticParams: StringKeyedSimpleObject) {
		// start off with a (shallow) clone of the statics...
		this._mergedParams = Object.assign({}, this._staticParams);

		// ...then merge in the dynamics, throwing in the event of a collision
		for (let k in this._dynamicParams) {
			if (this._mergedParams[k] !== undefined) {
				throw new Error('Merging model params with a dynamic-static collision (these are mutually exclusive); key: ' + k);
			}

			this._mergedParams[k] = this._dynamicParams[k];
		}
	}

	GetParam(key: string) {
		console.assert(key !== '');

		if (this._mergedParams[key] !== undefined) {
			return this._mergedParams[key];
		}

		throw new Error('ModelParams key not found: ' + key);
	}

//vv TODO: These move into a CSVSource interface
	WriteCSVLineKeys() {
		let textOut = '';

		for (let k in this._mergedParams) {
			textOut += k + ',';
		}

		// drop the trailing comma
		textOut = textOut.slice(0, -1);

		return textOut;
	}

	WriteCSVLineValues() {
		let textOut = '';

		for (let k in this._mergedParams) {
			// check every string for file-breakers, while we're here

//PERF: This is potentially overkill (we validate these early on in their lifecycle), and it _could_ matter.
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
