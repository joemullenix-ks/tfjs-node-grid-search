'use strict';
var FileReadResult = /** @class */ (function () {
    function FileReadResult() {
        this._data = '';
    }
    Object.defineProperty(FileReadResult.prototype, "data", {
        get: function () { return this._data; },
        set: function (data) {
            console.assert(typeof data === 'string');
            console.assert(data !== '');
            this._data = data;
        },
        enumerable: false,
        configurable: true
    });
    return FileReadResult;
}());
Object.freeze(FileReadResult);
exports.FileReadResult = FileReadResult;
