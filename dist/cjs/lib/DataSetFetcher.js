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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSetFetcher = void 0;
const DataSet_1 = require("./DataSet");
const FileIO_1 = require("./FileIO");
const FileIOResult_1 = require("./FileIOResult");
//TODO: Add more techniques, e.g. fetch via url (see below). When we make that pass, refactor this into an abstract
//		base, then implement dedicated fetchers e.g. URLDataSetFetcher, LocalFilesDataSetFetcher, etc...
//
// 	async function getData() {
// 		const dataResponse = await fetch('https:// ...');
// 		const data = await dataResponse.json();
// 		return data;
// 	}
class DataSetFetcher {
    constructor(nodeLaunchArguments) {
        this._pathInputs = '';
        this._pathTargets = '';
        if (nodeLaunchArguments.length < 4) {
            // show the user a template in 'warning' color, since this is a potential barrier to entry
            console.warn('Missing launch param(s)!' + '\n'
                + 'Example command line:' + '\n'
                + '  node my-tngs-app.js data_inputs.txt data_targets.txt' + '\n'
                + 'Example launch.json config:' + '\n'
                + '  "args": ["data_inputs.txt", "data_targets.txt"]' + '\n');
            throw new Error('Expecting two paths, the first to the input data, the  second to the targets.');
        }
        this._pathInputs = nodeLaunchArguments[2];
        this._pathTargets = nodeLaunchArguments[3];
    }
    Fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.ReadDataFiles();
            }
            catch (e) {
                console.error('Failed to fetch the data set. Please check the file paths.' + '\n', e);
                throw (e); // re-throw, else TS will get upset about return type
            }
        });
    }
    ReadDataFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Attempting to read data from the following files:' + '\n'
                + '   Inputs: ' + this._pathInputs + '\n'
                + '  Targets: ' + this._pathTargets);
            const FILE_IO_RESULT = new FileIOResult_1.FileIOResult();
            yield FileIO_1.FileIO.ReadDataFile(this._pathInputs, FILE_IO_RESULT);
            const INPUTS_FILE_DATA = JSON.parse(FILE_IO_RESULT.data);
            yield FileIO_1.FileIO.ReadDataFile(this._pathTargets, FILE_IO_RESULT);
            const TARGETS_FILE_DATA = JSON.parse(FILE_IO_RESULT.data);
            const DATA_SET = new DataSet_1.DataSet(INPUTS_FILE_DATA, TARGETS_FILE_DATA);
            return DATA_SET;
        });
    }
}
exports.DataSetFetcher = DataSetFetcher;
Object.freeze(DataSetFetcher);
//# sourceMappingURL=DataSetFetcher.js.map