'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileIOResult = void 0;
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
        console.assert(data !== '');
        this._data = data;
    }
}
exports.FileIOResult = FileIOResult;
Object.freeze(FileIOResult);
//# sourceMappingURL=FileIOResult.js.map