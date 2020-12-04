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
import { DataSet } from './DataSet';
import { FileIO } from './FileIO';
import { FileIOResult } from './FileIOResult';
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
            const FILE_IO_RESULT = new FileIOResult();
            yield FileIO.ReadDataFile(this._pathInputs, FILE_IO_RESULT);
            const INPUTS_FILE_DATA = JSON.parse(FILE_IO_RESULT.data);
            yield FileIO.ReadDataFile(this._pathTargets, FILE_IO_RESULT);
            const TARGETS_FILE_DATA = JSON.parse(FILE_IO_RESULT.data);
            const DATA_SET = new DataSet(INPUTS_FILE_DATA, TARGETS_FILE_DATA);
            return DATA_SET;
        });
    }
}
Object.freeze(DataSetFetcher);
export { DataSetFetcher };
//# sourceMappingURL=DataSetFetcher.js.map