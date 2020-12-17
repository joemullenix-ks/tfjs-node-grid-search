'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
test('instantiation', () => {
    const failureMessage = new main_1.FailureMessage();
    expect(failureMessage).toBeInstanceOf(main_1.FailureMessage);
    const TEXT_FULL = 'something';
    failureMessage.text = TEXT_FULL;
    expect(failureMessage.text).toBe(TEXT_FULL);
    // empty string is fatal
    expect(() => {
        failureMessage.text = '';
    }).toThrowError();
});
//# sourceMappingURL=FailureMessage.test.js.map