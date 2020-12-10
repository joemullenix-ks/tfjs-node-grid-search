'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @module FileIO
 */
import * as FS_PROMISES from 'fs/promises';
import * as PATH_LIB from 'path';
//NOTE: Moved this one to ESM for Lint; had hesitated only because it kicks this:
//
//		"This module can only be referenced with ECMAScript imports/exports by turning on
//		the 'esModuleInterop' flag and referencing its default export.ts(2497)"
import SLASH from 'slash';
import { Utils } from './Utils';
/**
 * Generates a search-output file name in the format "Results_&ltTIMESTAMP&gt.csv".
 * @return {string}
 */
const ProduceResultsFilename = () => {
    //TODO: hard-coder; both the regex and the file name prefix & suffix.
    const TIMESTAMP = (new Date()).toLocaleString();
    const FILTERED = TIMESTAMP.replace(/[^a-z0-9]/gi, '_');
    const LOWERED = FILTERED.toLowerCase();
    return 'Results_' + LOWERED + '.csv';
};
/**
 * Performs the async filesystem reads, and writes the output to the "results"
 * object. Relays exceptions to the main error-handling utility.
 * @param {string} path
 * @param {FileIOResult} result
 * @return {Promise<void>}
 */
const ReadDataFile = (path, result) => __awaiter(void 0, void 0, void 0, function* () {
    console.assert(path !== '');
    try {
        result.data = yield FS_PROMISES.readFile(path, 'utf8');
        return;
    }
    catch (e) {
        Utils.ThrowCaughtUnknown('Failed to read file: ' + path + '\n', e);
    }
});
/**
 * Performs the async filesystem writes. Builds a platform appropriate path
 * from the directory and file names. Relays exceptions to the main
 * error-handling utility.
 * @param {string} fileName
 * @param {string} directory
 * @param {string} dataToWrite
 * @return {Promise<void>}
 */
const WriteResultsFile = (fileName, directory, dataToWrite) => __awaiter(void 0, void 0, void 0, function* () {
    console.assert(fileName !== '');
    const WRITE_PATH = PATH_LIB.join(directory, fileName);
    // correct for Unix/Windows path format
    SLASH(WRITE_PATH);
    if (dataToWrite === '') {
        console.warn('Writing empty file: ' + WRITE_PATH);
    }
    try {
        yield FS_PROMISES.writeFile(WRITE_PATH, dataToWrite, 'utf8');
        return;
    }
    catch (e) {
        Utils.ThrowCaughtUnknown('Failed to write file: ' + WRITE_PATH, e);
    }
});
export { ProduceResultsFilename, ReadDataFile, WriteResultsFile };
//# sourceMappingURL=FileIO.js.map