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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILE_IO = void 0;
var FS_PROMISES = require('fs/promises');
var PATH_LIB = require('path');
var SLASH = require('slash');
var FILE_IO = {
    ProduceResultsFilename: function () {
        //TODO: hard-coder; both the regex and the filename prefix & suffix.
        var TIMESTAMP = (new Date()).toLocaleString();
        var FILTERED = TIMESTAMP.replace(/[^a-z0-9]/gi, '_');
        var LOWERED = FILTERED.toLowerCase();
        return 'Results_' + LOWERED + '.csv';
    },
    ReadDataFile: function (path, result) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.assert(path !== '');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    _a = result;
                    return [4 /*yield*/, FS_PROMISES.readFile(path, 'utf8')];
                case 2:
                    _a.data = _b.sent();
                    return [2 /*return*/];
                case 3:
                    err_1 = _b.sent();
                    throw new Error('Failed to read file: ' + path + '; ' + err_1.code + ', ' + err_1.message);
                case 4: return [2 /*return*/];
            }
        });
    }); },
    WriteResultsFile: function (fileName, directory, dataToWrite, result) { return __awaiter(void 0, void 0, void 0, function () {
        var WRITE_PATH, _a, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.assert(fileName !== '');
                    WRITE_PATH = PATH_LIB.join(directory, fileName);
                    // correct for Unix/Windows path format
                    SLASH(WRITE_PATH);
                    if (dataToWrite === '') {
                        console.warn('Writing empty file: ' + WRITE_PATH);
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    _a = result;
                    return [4 /*yield*/, FS_PROMISES.writeFile(WRITE_PATH, dataToWrite, 'utf8', 
                        //NOTE: This is nether TF nor any, technically, but it still needs to be confirmed. I picked "Error" out of
                        //		the wind.
                        //TODO: Come to think of it, I don't even believe this ever tripped, during testing. Seems like the
                        //		catch block was the only point-of-failure ... so confirm!
                        //
                        //[[TF ANY]]
                        function (err) {
                            //NOTE: It seems that this doesn't get called, at least not for successful writes. The outer try/catch works,
                            //		however. It catches bad-path and bad-content. Maybe it precludes this? Unsure, but it's not hurting
                            //		anything, so it stays.
                            if (err) {
                                throw err;
                            }
                            console.log('file written');
                        })];
                case 2:
                    _a.data = _b.sent();
                    return [2 /*return*/];
                case 3:
                    err_2 = _b.sent();
                    throw new Error('Failed to write file: ' + WRITE_PATH + '; ' + err_2.code + ', ' + err_2.message);
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
exports.FILE_IO = FILE_IO;
Object.freeze(FILE_IO);
//# sourceMappingURL=FileIO.js.map