import { DataSet } from './DataSet';
/**
 * Retrieves the data to be used for training and testing, and uses that data to
 * create an instance of {@link DataSet}. Currently limited to fetching from
 * local files. The file reads are done asynchronously.
 * Note: Fetching via URL is coming soon!
 */
declare class DataSetFetcher {
    private _pathInputs;
    private _pathTargets;
    /**
     * Creates an instance of DataSetFetcher.
     * @param {Array<string>} nodeLaunchArguments An array of strings, in which
     *											  the 3rd and 4th are the input
     *											  and target file paths,
     *											  respectively. This is written
     *											  specifically to take the Node
     *											  launch params (process.argv).
     */
    constructor(nodeLaunchArguments: Array<string>);
    /**
     * Loads the data asynchronously. Throws if a file path is missing/invalid.
     * @return {Promise<DataSet>}
     */
    Fetch(): Promise<DataSet>;
    /**
     * Handles the file reads, and returns a {@link DataSet} with the results.
     * @private
     * @return {Promise<DataSet>}
     */
    private ReadDataFiles;
}
export { DataSetFetcher };
