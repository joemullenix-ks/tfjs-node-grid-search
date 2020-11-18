'use strict';
var Utils = require('./Utils').Utils;
var GridOptions = /** @class */ (function () {
    function GridOptions(options) {
        if (typeof options !== 'object') {
            console.assert(options === null || options === undefined);
        }
        // merge the user-supplied options w/ the default options
        for (var k in options) {
            if (ALL_AVAILABLE_OPTIONS[k] !== undefined) {
                continue;
            }
            //NOTE: This complex error report is here to help the user, because looking up config params in documentation sucks.
            //		This way, we're explicit about what's actually supported (in this version).
            // First we console-error, to get the actual problem out of the way...
            var ERROR_TEXT = 'Unknown option encountered: ' + k;
            //NOTE: If the IDE/terminal is set to break on these - before we get our details out - so be it (that's likely a power-user anyway).
            console.error(ERROR_TEXT);
            // ...next we print the list of available option keys...
            console.log('The following options are suppored:');
            for (var l in ALL_AVAILABLE_OPTIONS) {
                console.log(l);
            }
            // ...then we throw, having given the user the exact information they need.
            throw new Error(ERROR_TEXT);
        }
        var DEFAULT_OPTIONS = {
            epochStatsDepth: 5,
            repetitions: 1,
            validationSetSizeMin: 100
            // These properties are intentionally left out (i.e. off by default):
            // writeResultsToDirectory: '<PATH>'
        };
        if (options === null || options === undefined) {
            // nothing received; set defaults
            options = DEFAULT_OPTIONS;
            // send the defaults through validation, to double-check these values, and especially future changes.
        }
        var ERROR_PREFIX = 'Grid option ';
        for (var k in options) {
            var OPTION = options[k];
            switch (k) {
                case 'epochStatsDepth':
                case 'repetitions':
                case 'validationSetSizeMin':
                    {
                        if (!Utils.CheckPositiveInteger(OPTION)) {
                            throw new Error(ERROR_PREFIX + '"' + k + '" must be a positive integer.');
                        }
                    }
                    break;
                case 'writeResultsToDirectory':
                    {
                        if (typeof OPTION !== 'string') {
                            throw new Error(ERROR_PREFIX + '"' + k + '" expects a string (the path of an existing directory).');
                        }
                        var WRITE_TO_ROOT = OPTION === '' || OPTION === './';
                        var MESSAGE_PREFIX = 'Results will be written to ';
                        if (WRITE_TO_ROOT) {
                            console.log(MESSAGE_PREFIX + 'the current directory.');
                        }
                        else {
                            // confirm this is a valid path of an existing directory (not a file)
                            var FS = require('fs');
                            //TODO: Move these to FileIO (or FileIOSync).
                            //TODO: (low-pri) Have that lib create the directory, if it doesn't exist ... maybe.
                            if (!FS.existsSync(OPTION)) {
                                throw new Error(ERROR_PREFIX + '"' + k + '" path not found: "' + OPTION + '"');
                            }
                            var FILE_STAT = FS.lstatSync(OPTION);
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
        // now merge the defaults into the user's options; any they didn't set
        for (var k in DEFAULT_OPTIONS) {
            if (options[k] === undefined) {
                options[k] = DEFAULT_OPTIONS[k];
            }
        }
        // set the active options to our root
        for (var k in options) {
            //NOTE: Kind of an experiment, here. ...not thrilled with it; likely to break minification.
            //TODO: Implement minification, friend. We'll know shortly!
            this['_' + k] = options[k];
        }
    }
    Object.defineProperty(GridOptions.prototype, "epochStatsDepth", {
        get: function () { return this._epochStatsDepth; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GridOptions.prototype, "repetitions", {
        get: function () { return this._repetitions; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GridOptions.prototype, "validationSetSizeMin", {
        get: function () { return this._validationSetSizeMin; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GridOptions.prototype, "writeResultsToDirectory", {
        get: function () { return this._writeResultsToDirectory; },
        enumerable: false,
        configurable: true
    });
    return GridOptions;
}());
var ALL_AVAILABLE_OPTIONS = {
    epochStatsDepth: null,
    repetitions: null,
    validationSetSizeMin: null,
    writeResultsToDirectory: null
};
Object.freeze(GridOptions);
exports.GridOptions = GridOptions;
