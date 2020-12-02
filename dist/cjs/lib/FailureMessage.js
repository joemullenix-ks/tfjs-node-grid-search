'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailureMessage = void 0;
class FailureMessage {
    constructor() {
        this._text = '';
        // Lint gripes about empty constructors. Apperently this is good enough. Party on.
    }
    get text() { return this._text; }
    set text(text) {
        console.assert(text !== '');
        this._text = text;
    }
}
exports.FailureMessage = FailureMessage;
Object.freeze(FailureMessage);
//# sourceMappingURL=FailureMessage.js.map