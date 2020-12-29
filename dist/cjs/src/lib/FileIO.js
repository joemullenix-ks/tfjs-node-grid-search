'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STANDARD_ENCODING = exports.WriteSystemPath = exports.WriteResultsFile = exports.ReadDataFile = exports.ProduceResultsFilename = void 0;
/**
 * @module FileIO
 */
const FS_PROMISES = __importStar(require("fs/promises"));
const PATH_LIB = __importStar(require("path"));
const slash_1 = __importDefault(require("slash"));
const Utils = __importStar(require("./Utils"));
//TODO: Expand our supported character sets, when requested.
const STANDARD_ENCODING = 'utf8';
exports.STANDARD_ENCODING = STANDARD_ENCODING;
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
exports.ProduceResultsFilename = ProduceResultsFilename;
/**
 * Performs the async filesystem reads, and writes the output to the "results"
 * object. Relays exceptions to the main error-handling utility.
 * @param {string} path
 * @param {FileIOResult} result
 * @return {Promise<void>}
 */
const ReadDataFile = (path, result) => __awaiter(void 0, void 0, void 0, function* () {
    Utils.Assert(path !== '');
    try {
        result.data = yield FS_PROMISES.readFile(path, STANDARD_ENCODING);
        return;
    }
    catch (e) {
        Utils.ThrowCaughtUnknown('Failed to read file: ' + path + '\n', e);
    }
});
exports.ReadDataFile = ReadDataFile;
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
    Utils.Assert(fileName !== '');
    const WRITE_PATH = WriteSystemPath(directory, fileName);
    if (dataToWrite === '') {
        console.warn('Writing empty file: ' + WRITE_PATH);
    }
    try {
        yield FS_PROMISES.writeFile(WRITE_PATH, dataToWrite, STANDARD_ENCODING);
        return;
    }
    catch (e) {
        Utils.ThrowCaughtUnknown('Failed to write file: ' + WRITE_PATH, e);
    }
});
exports.WriteResultsFile = WriteResultsFile;
/**
 * Assemble a directory and filename with the system-appropriate slashes.
 * @param {string} directory
 * @param {string} fileName
 * @return {string}
 */
const WriteSystemPath = (directory, fileName) => {
    const SYSTEM_PATH = PATH_LIB.join(directory, fileName);
    // correct for Unix/Windows path format
    slash_1.default(SYSTEM_PATH);
    return SYSTEM_PATH;
};
exports.WriteSystemPath = WriteSystemPath;
//# sourceMappingURL=FileIO.js.map