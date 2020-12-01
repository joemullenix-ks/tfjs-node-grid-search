'use strict';
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
Object.freeze(FailureMessage);
export { FailureMessage };
//# sourceMappingURL=FailureMessage.js.map