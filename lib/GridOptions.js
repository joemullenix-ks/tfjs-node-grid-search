'use strict';


const { Utils } = require('./Utils');


class GridOptions {
	constructor(options) {
		if (typeof options !== 'object') {
			console.assert(options === null || options === undefined);
		}

		const ALL_OPTIONS = {
								repetitions: null,
								writeResultsToDirectory: null
							};

		// now merge the user options w/ the default options
		for (let k in options) {
			if (ALL_OPTIONS[k] !== undefined) {
				continue;
			}

//NOTE: This mess is here to help the user, because looking up config params in the documentation can suck.
//		This way, we're explicit about what's actually supported (in this version).

			// First we console-error, to get the actual problem out of the way. If the IDE/terminal is set to break
			// on that, so be it; likely a power-user situation...

			const ERROR_TEXT = 'Unknown option encountered: ' + k;

			console.error(ERROR_TEXT);

			// ...next we print the list of available option keys...

			console.log('The following options are suppored:');

			for (let l in ALL_OPTIONS) {
				console.log(l);
			}

			// ...then we throw, having given the user the exact information they need.
			throw new Error(ERROR_TEXT);
		}

		const DEFAULT_OPTIONS = {
									repetitions: 1

									// These properties are intentionally left out (i.e. off by default):
									// writeResultsToDirectory: '<PATH>'
								};

		if (options === null || options === undefined) {
			// nothing received; set defaults
			options = DEFAULT_OPTIONS;

//NOTE: We pass these defaults through validation, to double-check our values, as well as future additions/changes.
		}

		const ERROR_PREFIX = 'Grid option ';

		if (options.repetitions !== undefined) {
			if (!Utils.CheckPositiveInteger(options.repetitions)) {
				throw new Error(ERROR_PREFIX + '"repetitions" must be a positive integer.');
			}
		}

		if (options.writeResultsToDirectory !== undefined) {
			if (typeof options.writeResultsToDirectory !== 'string') {
				throw new Error(ERROR_PREFIX + '"writeResultsToDirectory" expects a string (the path of an existing directory).');
			}

			const WRITE_TO_ROOT =	options.writeResultsToDirectory === ''
								 || options.writeResultsToDirectory === './';

			const MESSAGE_PREFIX = 'Results will be written to ';

			if (WRITE_TO_ROOT) {
				console.log(MESSAGE_PREFIX + 'the current directory.');
			}
			else {
				// confirm this path exists, as a directory (not a file)
				const FS = require('fs');

//TODO: Move these to FileIO (or FileIOSync).
//TODO: (low-pri) Have that lib create the directory, if it doesn't exist ... maybe.

				if (!FS.existsSync(options.writeResultsToDirectory)) {
					throw new Error(ERROR_PREFIX + '"writeResultsToDirectory" path not found: "' + options.writeResultsToDirectory + '"');
				}

				const FILE_STAT = FS.lstatSync(options.writeResultsToDirectory);

				if (!FILE_STAT.isDirectory()) {
					throw new Error(ERROR_PREFIX + '"writeResultsToDirectory" path is not a directory: "' + options.writeResultsToDirectory + '"');
				}

				console.log(MESSAGE_PREFIX + '"' + options.writeResultsToDirectory + '".');
			}
		}

		// now merge the defaults into the user's options, and set them all to our root
		for (let k in DEFAULT_OPTIONS) {
			if (options[k] === undefined) {
				options[k] = DEFAULT_OPTIONS[k];
			}
		}

		// set the active options to our root
		for (let k in options) {
//NOTE: Kind of an experiment, here. ...not thrilled with it, but curious to try; likely to break minification.
//TODO: Implement minification, friend. We'll know shortly!

			this['_' + k] = options[k];
		}
	}

	get repetitions() { return this._repetitions; }
	get writeResultsToDirectory() { return this._writeResultsToDirectory; }
}


Object.freeze(GridOptions);

exports.GridOptions = GridOptions;
