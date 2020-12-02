'use strict';


import * as Types from '../ts_types/common';


import * as FS from 'fs';


import { Utils } from './Utils';


//NOTE: TODO: Not entirely thrilled with this class. It has a lot in common with ModelStatics, but the two
//			  are implemented very differently. Part of that is due to ModelStatics's dependence on baked-in
//			  TensorFlow keys, but it's also due to project churn and the TypeScript conversion process.
//			  Revisit both classes, and settle on a common approach.


class GridOptions {
	private _options: Types.StringKeyedSimpleObject = {};

	constructor(userOptions?: Types.StringKeyedSimpleObject) {
		if (typeof userOptions !== 'object') {
			console.assert(userOptions === null || userOptions === undefined);
		}

		// merge the user-supplied options w/ the default options
		for (const k in userOptions) {
			if (ALL_AVAILABLE_OPTIONS[k] !== undefined) {
				continue;
			}

//NOTE: This complex error report is here to help the user, because looking up config params in documentation sucks.
//		This way, we're explicit about what's actually supported (in this version).

			// First we console-error, to get the actual problem out of the way...

			const ERROR_TEXT = 'Unknown option encountered: ' + k;

//NOTE: If the IDE/terminal is set to break on these - before we get our details out - so be it (that's likely a power-user anyway).
			console.error(ERROR_TEXT);

			// ...next we print the list of available option keys...

			console.log('The following options are suppored:');

			for (const l in ALL_AVAILABLE_OPTIONS) {
				console.log(l);
			}

			// ...then we throw, having given the user the exact information they need.
			throw new Error(ERROR_TEXT);
		}

		const DEFAULT_OPTIONS:Types.StringKeyedSimpleObject =	{
																	epochStatsDepth: 5,
																	repetitions: 1,
																	validationSetSizeMin: 100

																	// These properties are intentionally left out (i.e. off by default):
																	// writeResultsToDirectory: '<PATH>'
																};

		if (userOptions === null || userOptions === undefined) {
			// nothing received; set defaults
			userOptions = DEFAULT_OPTIONS;

			// send the defaults through validation, to double-check these values, and especially future changes.
		}

		const ERROR_PREFIX = 'Grid option ';

		for (const k in userOptions) {
			const OPTION = userOptions[k];

			switch (k) {
				case 'epochStatsDepth':
				case 'repetitions':
				case 'validationSetSizeMin': {
					if (typeof OPTION !== 'number') {
						throw new Error(ERROR_PREFIX + '"' + k + '" must be a number.');
					}

					if (!Utils.CheckPositiveInteger(OPTION)) {
						throw new Error(ERROR_PREFIX + '"' + k + '" must be a positive integer.');
					}
				}
				break;

				case 'writeResultsToDirectory': {
					if (typeof OPTION !== 'string') {
						throw new Error(ERROR_PREFIX + '"' + k + '" expects a string (the path of an existing directory).');
					}

					const WRITE_TO_ROOT = OPTION === '' || OPTION === './';

					const MESSAGE_PREFIX = 'Results will be written to ';

					if (WRITE_TO_ROOT) {
						console.log(MESSAGE_PREFIX + 'the current directory.');
					}
					else {
						// confirm this is a valid path of an existing directory (not a file)

//TODO: Move these to FileIO (or FileIOSync).
//TODO: (low-pri) Have that lib create the directory, if it doesn't exist ... maybe.

						if (!FS.existsSync(OPTION)) {
							throw new Error(ERROR_PREFIX + '"' + k + '" path not found: "' + OPTION + '"');
						}

						const FILE_STAT = FS.lstatSync(OPTION);

						if (!FILE_STAT.isDirectory()) {
							throw new Error(ERROR_PREFIX + '"' + k + '" path is not a directory: "' + OPTION + '"');
						}

						console.log(MESSAGE_PREFIX + '"' + OPTION + '".');
					}
				}
				break;

				default: {
					throw new Error('unsupported GridOptions key: ' + k);
				}
			}
		}

		// now merge the defaults into the user's options; any for which we provide a value, but the user sent nothing
		for (const k in DEFAULT_OPTIONS) {
			if (userOptions[k] === undefined) {
				userOptions[k] = DEFAULT_OPTIONS[k];
			}
		}

		// now save this processed object; NOTE: It's not a private c'tor member because it's optional
		this._options = userOptions;
	}

	GetOption(key: string): string | number | boolean | undefined {
		switch (key) {
			case 'epochStatsDepth':
			case 'repetitions':
			case 'validationSetSizeMin':
			case 'writeResultsToDirectory': {
//NOTE: This value may be undefined. That's expected. We enforce that all user-supplied keys be known, but we
//		do not require the user to set a value for every possible key.
//		For example, if they don't want to save CSV files, they do not send "writeResultsToDirectory".
				return this._options[key];
			}

			default: {
				throw new Error('unknown option key: ' + key);
			}
		}

	}
}


//KEEP: TODO: (low-pri until TS conversion) Instead of hard-coding the option keys, implement this enum.
//			  Also, I believe we'll use it to replace ALL_AVAILABLE_OPTIONS.
//
// enum Names { << TS can't export "const enum", btw
// 	EPOCH_STATS_DEPTH			= 'epochStatsDepth',
// 	REPETITIONS					= 'repetitions',
// 	VALIDATION_SET_SIZE_MIN		= 'validationSetSizeMin',
// 	WRITE_RESULTS_TO_DIRECTORY	= 'writeResultsToDirectory'
// }


const ALL_AVAILABLE_OPTIONS: Types.StringKeyedNullsObject =	{
																epochStatsDepth: null,
																repetitions: null,
																validationSetSizeMin: null,
																writeResultsToDirectory: null
															};


Object.freeze(GridOptions);

export { GridOptions };
