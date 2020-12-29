import { FileIOResult } from './FileIOResult';
declare const STANDARD_ENCODING = "utf8";
/**
 * Generates a search-output file name in the format "Results_&ltTIMESTAMP&gt.csv".
 * @return {string}
 */
declare const ProduceResultsFilename: () => string;
/**
 * Performs the async filesystem reads, and writes the output to the "results"
 * object. Relays exceptions to the main error-handling utility.
 * @param {string} path
 * @param {FileIOResult} result
 * @return {Promise<void>}
 */
declare const ReadDataFile: (path: string, result: FileIOResult) => Promise<void>;
/**
 * Performs the async filesystem writes. Builds a platform appropriate path
 * from the directory and file names. Relays exceptions to the main
 * error-handling utility.
 * @param {string} fileName
 * @param {string} directory
 * @param {string} dataToWrite
 * @return {Promise<void>}
 */
declare const WriteResultsFile: (fileName: string, directory: string, dataToWrite: string) => Promise<void>;
/**
 * Assemble a directory and filename with the system-appropriate slashes.
 * @param {string} directory
 * @param {string} fileName
 * @return {string}
 */
declare const WriteSystemPath: (directory: string, fileName: string) => string;
export { ProduceResultsFilename, ReadDataFile, WriteResultsFile, WriteSystemPath, STANDARD_ENCODING };
