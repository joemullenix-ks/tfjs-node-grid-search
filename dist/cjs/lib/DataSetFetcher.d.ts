import { DataSet } from './DataSet';
declare class DataSetFetcher {
    private _pathInputs;
    private _pathTargets;
    constructor(nodeLaunchArguments: Array<string>);
    Fetch(): Promise<DataSet>;
    private ReadDataFiles;
}
export { DataSetFetcher };
