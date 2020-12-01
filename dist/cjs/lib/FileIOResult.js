'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileIOResult = void 0;
class FileIOResult {
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