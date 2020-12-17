'use strict';
import { FailureMessage } from '../src/main';
test('instantiation', () => {
    const failureMessage = new FailureMessage();
    expect(failureMessage).toBeInstanceOf(FailureMessage);
    const TEXT_FULL = 'something';
    failureMessage.text = TEXT_FULL;
    expect(failureMessage.text).toBe(TEXT_FULL);
    // empty string is fatal
    expect(() => {
        failureMessage.text = '';
    }).toThrowError();
});
//# sourceMappingURL=FailureMessage.test.js.map