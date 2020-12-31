'use strict';


import { ArrayOrder2, TFNestedArray } from './types';


import { DataSet } from './DataSet';
import * as FileIO from './FileIO';
import { FileIOResult } from './FileIOResult';


//TODO: Add more techniques, e.g. fetch via url (example below). When we make that pass, refactor this into an abstract
//		base, then implement dedicated fetchers e.g. URLDataSetFetcher, LocalFilesDataSetFetcher, etc...
//
// 	async function getData() {
// 		const dataResponse = await fetch('https:// ...');
// 		const data = await dataResponse.json();
// 		return data;
// 	}


/**
 * Retrieves the data to be used for training and testing, and uses that data to
 * create an instance of {@link DataSet}. Currently limited to fetching from
 * local files. The file reads are done asynchronously.
 * Note: Fetching via URL is coming soon!
 */
class DataSetFetcher {
	private _pathInputs = '';
	private _pathTargets = '';

	/**
	 * Creates an instance of DataSetFetcher.
	 * @param {Array<string>} nodeLaunchArguments An array of strings, in which
	 *											  the 3rd and 4th are the input
	 *											  and target file paths,
	 *											  respectively. This is written
	 *											  specifically to take the Node
	 *											  launch params (process.argv).
	 */
	constructor(nodeLaunchArguments: Array<string>) {
		if (nodeLaunchArguments.length < 4
			|| nodeLaunchArguments[2] === nodeLaunchArguments[3]) {
			// show the user a template in 'warning' color, since this is a potential barrier to entry
			console.warn('Missing launch param(s)!' + '\n'
							+ 'Example command line:' + '\n'
							+ '  node my-tngs-app.js data_inputs.txt data_targets.txt' + '\n'
							+ 'Example launch.json config:' + '\n'
							+ '  "args": ["data_inputs.txt", "data_targets.txt"]' + '\n');

			throw new Error('Expecting two paths, the first to the input data, the second to the targets.');
		}

		this._pathInputs = nodeLaunchArguments[2];

		this._pathTargets = nodeLaunchArguments[3];
	}

	/**
	 * Loads the data asynchronously. Throws if a file path is missing/invalid.
	 * @return {Promise<DataSet>}
	 */
	async Fetch(): Promise<DataSet> {
		try {
			return await this.ReadDataFiles();
		} catch (e) {
			/* istanbul ignore next */ //[FUTURE PROOFING]
			console.error('Failed to fetch the data set. Please check the file paths.' + '\n', e);

			/* istanbul ignore next */ //[FUTURE PROOFING]
			throw (e); // re-throw, else TS will get upset about return type
		}
	}

	/**
	 * Handles the file reads, and returns a {@link DataSet} with the results.
	 * @private
	 * @return {Promise<DataSet>}
	 */
	private async ReadDataFiles(): Promise<DataSet> {
		console.log('Attempting to read data from the following files:' + '\n'
			+ '   Inputs: ' + this._pathInputs + '\n'
			+ '  Targets: ' + this._pathTargets);

		const FILE_IO_RESULT = new FileIOResult();

		await FileIO.ReadDataFile(this._pathInputs, FILE_IO_RESULT);

		const INPUTS_FILE_DATA = JSON.parse(FILE_IO_RESULT.data) as TFNestedArray;

		await FileIO.ReadDataFile(this._pathTargets, FILE_IO_RESULT);

		const TARGETS_FILE_DATA = JSON.parse(FILE_IO_RESULT.data) as ArrayOrder2;

		const DATA_SET = new DataSet(INPUTS_FILE_DATA, TARGETS_FILE_DATA);

		return DATA_SET;
	}
}


Object.freeze(DataSetFetcher);

export { DataSetFetcher };
