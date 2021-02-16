'use strict';
import * as FS from 'fs';
import * as Utils from './Utils';
//NOTE: TODO: Not entirely thrilled with this class. It has a lot in common with
//            ModelStatics, but the two are implemented very differently. Part
//            of that is due to ModelStatics's dependence on baked-in
//            TensorFlow keys, but it's also due to project churn and the
//            TypeScript conversion process.
//            Revisit both classes, and settle on a common approach.
/**
 * The config of a grid search. Takes all settings that are not hyperparameters
 * or parts of a network model, all of them optional.
 */
class GridOptions {
    /**
     * Creates an instance of GridOptions.
     * @param {Types.StringKeyedSimpleObject} userOptions
     * @example
     * new tngs.GridOptions({
     *   epochStatsDepth: 10,         // Length of the trailing average; default 5
     *   repetitions: 3,              // Number of times to repeat each iteration of the grid; default 1
     *   resultsDirectory: ''         // Directory in which results files are written; default './' (current directory)
     *   validationSetSizeMin: 50,    // Fewer than x validation cases triggers a warning; default 100
     *   writeResultsAsCSV: true      // Whether to output results as a CSV file; default true
     * });
     */
    constructor(userOptions) {
        this._options = {};
        let keysFound = false;
        // validate each key supplied by the user
        for (const k in userOptions) {
            keysFound = true;
            if (ALL_AVAILABLE_OPTIONS[k] !== undefined) {
                continue;
            }
            //NOTE: This complex error report is here to help the user, because looking up
            //      config params in documentation sucks.
            //		This way, we're explicit about what's supported (in this version).
            // First we console-error, to get the actual problem out of the way...
            const ERROR_TEXT = 'Unknown grid-options parameter encountered: ' + k;
            //NOTE: If the IDE/terminal is set to break on these - before we get our details
            //      out - so be it (that's likely a power-user anyway).
            console.error(ERROR_TEXT);
            // ...next we print the list of available option keys...
            console.log('The following parameter are suppored:');
            for (const l in ALL_AVAILABLE_OPTIONS) {
                //TODO: Include defaults with these.
                console.log(l);
            }
            // ...then we throw, having given the user the exact info they need.
            throw new Error(ERROR_TEXT);
        }
        const DEFAULT_OPTIONS = {
            epochStatsDepth: GridOptions.DEFAULT_EPOCH_STATS_DEPTH,
            repetitions: GridOptions.DEFAULT_REPETITIONS,
            resultsDirectory: GridOptions.DEFAULT_RESULTS_DIRECTORY,
            validationSetSizeMin: GridOptions.DEFAULT_VALIDATION_SET_SIZE_MIN,
            writeResultsAsCSV: GridOptions.DEFAULT_WRITE_RESULTS_AS_CSV
        };
        if (!keysFound) {
            // empty object received; set pure defaults
            userOptions = DEFAULT_OPTIONS;
            //NOTE: We send these defaults through validation, to double-check our values,
            //      and (especially) catch bad edits in the future.
            //PERF: It's technically an unnecessary hit, but it's negligible.
        }
        const ERROR_PREFIX = 'Grid option ';
        // validate each value supplied by the user
        for (const k in userOptions) {
            const OPTION = userOptions[k];
            switch (k) {
                case 'epochStatsDepth':
                case 'repetitions':
                case 'validationSetSizeMin':
                    {
                        if (typeof OPTION !== 'number') {
                            throw new Error(ERROR_PREFIX + '"' + k + '" must be a '
                                + 'number.');
                        }
                        if (!Utils.CheckPositiveInteger(OPTION)) {
                            throw new Error(ERROR_PREFIX + '"' + k + '" must be a '
                                + 'positive integer.');
                        }
                    }
                    break;
                case 'resultsDirectory':
                    {
                        if (typeof OPTION !== 'string') {
                            throw new Error(ERROR_PREFIX + '"' + k + '" expects a '
                                + 'string (the path of an existing directory).');
                        }
                        const WRITE_TO_ROOT = OPTION === '' || OPTION === './';
                        const MESSAGE_PREFIX = 'Results will be written to ';
                        if (WRITE_TO_ROOT) {
                            console.log(MESSAGE_PREFIX + 'the current directory.');
                        }
                        else {
                            // confirm this is a valid path of an existing directory
                            // as opposed to a file
                            //TODO: Move these to FileIO (or FileIOSync).
                            //TODO: (low-pri) Have that lib create the directory, if it doesn't exist ... maybe.
                            if (!FS.existsSync(OPTION)) {
                                throw new Error(ERROR_PREFIX + '"' + k + '" path '
                                    + 'not found: "' + OPTION + '"');
                            }
                            const FILE_STAT = FS.lstatSync(OPTION);
                            if (!FILE_STAT.isDirectory()) {
                                throw new Error(ERROR_PREFIX + '"' + k + '" path '
                                    + 'is not a directory: "' + OPTION + '"');
                            }
                            console.log(MESSAGE_PREFIX + '"' + OPTION + '".');
                        }
                    }
                    break;
                case 'writeResultsAsCSV':
                    {
                        if (typeof OPTION !== 'boolean') {
                            throw new Error(ERROR_PREFIX + '"' + k + '" must be '
                                + 'true or false.');
                        }
                    }
                    break;
                /* istanbul ignore next */ //[FUTURE PROOFING]
                default: {
                    throw new Error('unsupported GridOptions key: ' + k);
                }
            }
        }
        // now merge the defaults into the user's options; any for which we
        // provide a value, but the user sent nothing
        for (const k in DEFAULT_OPTIONS) {
            if (userOptions[k] !== undefined) {
                continue;
            }
            userOptions[k] = DEFAULT_OPTIONS[k];
        }
        // now save this processed object; NOTE: It's not a private c'tor member
        // because it's optional
        this._options = userOptions;
    }
    /**
     * Returns the value for a setting key, or undefined, if none was supplied
     * to the constructor.
     * @param {string} key
     * @return {(string | number | boolean | undefined)}
     */
    GetOption(key) {
        switch (key) {
            case 'epochStatsDepth':
            case 'repetitions':
            case 'resultsDirectory':
            case 'validationSetSizeMin':
            case 'writeResultsAsCSV': {
                //NOTE: The value may be undefined. That's expected. We enforce that all
                //      user-supplied keys be known, but we do not require the user to set a
                //      value for every possible key. We have defaults for that case.
                return this._options[key];
            }
            default: {
                throw new Error('unknown option key: ' + key);
            }
        }
    }
}
GridOptions.DEFAULT_EPOCH_STATS_DEPTH = 5;
GridOptions.DEFAULT_REPETITIONS = 1;
GridOptions.DEFAULT_RESULTS_DIRECTORY = './';
GridOptions.DEFAULT_VALIDATION_SET_SIZE_MIN = 100;
GridOptions.DEFAULT_WRITE_RESULTS_AS_CSV = false;
const ALL_AVAILABLE_OPTIONS = {
    epochStatsDepth: null,
    repetitions: null,
    resultsDirectory: null,
    validationSetSizeMin: null,
    writeResultsAsCSV: null
};
Object.freeze(GridOptions);
export { GridOptions };
//# sourceMappingURL=GridOptions.js.map