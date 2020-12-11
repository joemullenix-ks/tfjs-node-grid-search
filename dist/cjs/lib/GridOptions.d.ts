import * as Types from './types';
/**
 * The config of a grid search. Takes all settings that are not hyperparameters
 * or parts of a network model, all of them optional.
 */
declare class GridOptions {
    private _options;
    /**
     * Creates an instance of GridOptions.
     * @param {Types.StringKeyedSimpleObject} [userOptions]
     * @example
     * new tngs.GridOptions({
     *   epochStatsDepth: 10,         // Length of the trailing average; default 5
     *   repetitions: 3,              // Number of times to repeat each iteration of the grid; default 1
     *   validationSetSizeMin: 50,    // Fewer than x validation cases triggers a warning; default 100
     *   writeResultsToDirectory: ''  // Directory in which a results file is written; off by default (do not write CSV)
     * });
     */
    constructor(userOptions?: Types.StringKeyedSimpleObject);
    /**
     * Returns the value for a setting key, or undefined, if none was supplied
     * to the constructor.
     * @param {string} key
     * @return {(string | number | boolean | undefined)}
     */
    GetOption(key: string): string | number | boolean | undefined;
}
export { GridOptions };
