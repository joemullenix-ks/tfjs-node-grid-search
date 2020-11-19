'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileReadResult = void 0;
var FileReadResult = /** @class */ (function () {
    function FileReadResult() {
        this._data = '';
    }
    Object.defineProperty(FileReadResult.prototype, "data", {
        get: function () { return this._data; },
        set: function (data) {
            console.assert(data !== '');
            this._data = data;
        },
        enumerable: false,
        configurable: true
    });
    return FileReadResult;
}());
exports.FileReadResult = FileReadResult;
Object.freeze(FileReadResult);
//# sourceMappingURL=FileReadResult.js.map