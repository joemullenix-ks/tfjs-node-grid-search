'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTime = void 0;
//TEMP
var DateTime = /** @class */ (function () {
    function DateTime() {
        this._data = '';
        // Lint gripes about empty constructors. Apperently this is good enough. Party on.
    }
    Object.defineProperty(DateTime.prototype, "data", {
        get: function () { return this._data; },
        set: function (data) {
            console.assert(data !== '');
            this._data = data;
        },
        enumerable: false,
        configurable: true
    });
    return DateTime;
}());
exports.DateTime = DateTime;
Object.freeze(DateTime);
//# sourceMappingURL=DateTime.js.map