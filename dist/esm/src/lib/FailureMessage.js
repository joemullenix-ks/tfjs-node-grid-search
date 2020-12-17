'use strict';
import * as Utils from './Utils';
/**
 * Simple class for retrieving details/info/instructions from a failed check.
 */
class FailureMessage {
    /**
    * Creates an instance of FailureMessage.
    */
    constructor() {
        this._text = '';
        // Lint gripes about empty constructors. Apperently this is good enough. Party on.
    }
    get text() { return this._text; }
    set text(text) {
        Utils.Assert(text !== '');
        this._text = text;
    }
}
Object.freeze(FailureMessage);
export { FailureMessage };
//# sourceMappingURL=FailureMessage.js.map