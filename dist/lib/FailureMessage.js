'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailureMessage = void 0;
var FailureMessage = /** @class */ (function () {
    function FailureMessage() {
        this._text = '';
        // Lint gripes about empty constructors. Apperently this is good enough. Party on.
    }
    Object.defineProperty(FailureMessage.prototype, "text", {
        get: function () { return this._text; },
        set: function (text) {
            console.assert(text !== '');
            this._text = text;
        },
        enumerable: false,
        configurable: true
    });
    return FailureMessage;
}());
exports.FailureMessage = FailureMessage;
Object.freeze(FailureMessage);
//# sourceMappingURL=FailureMessage.js.map