'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileIOResult = void 0;
var FileIOResult = /** @class */ (function () {
    function FileIOResult() {
        this._data = '';
    }
    Object.defineProperty(FileIOResult.prototype, "data", {
        get: function () { return this._data; },
        set: function (data) {
            console.assert(data !== '');
            this._data = data;
        },
        enumerable: false,
        configurable: true
    });
    return FileIOResult;
}());
exports.FileIOResult = FileIOResult;
Object.freeze(FileIOResult);
//# sourceMappingURL=FileIOResult.js.map