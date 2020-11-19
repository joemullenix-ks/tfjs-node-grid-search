'use strict';
var FailureMessage = /** @class */ (function () {
    function FailureMessage() {
        this._text = '';
    }
    Object.defineProperty(FailureMessage.prototype, "text", {
        get: function () { return this._text; },
        set: function (text) {
            console.assert(typeof text === 'string');
            console.assert(text !== '');
            this._text = text;
        },
        enumerable: false,
        configurable: true
    });
    return FailureMessage;
}());
Object.freeze(FailureMessage);
exports.FailureMessage = FailureMessage;
//# sourceMappingURL=FailureMessage.js.map