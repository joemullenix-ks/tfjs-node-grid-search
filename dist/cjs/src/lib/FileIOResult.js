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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileIOResult = void 0;
const Utils = __importStar(require("./Utils"));
/**
 * Simple class for saving data from file reads.
 */
class FileIOResult {
    /**
     * Creates an instance of FileIOResult.
     */
    constructor() {
        this._data = '';
        // Lint gripes about empty constructors. Apperently this is good enough. Party on.
    }
    get data() { return this._data; }
    set data(data) {
        Utils.Assert(data !== '');
        this._data = data;
    }
}
exports.FileIOResult = FileIOResult;
Object.freeze(FileIOResult);
//# sourceMappingURL=FileIOResult.js.map