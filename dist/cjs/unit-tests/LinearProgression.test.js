/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const LinearProgression_1 = require("../src/lib/progression/LinearProgression");
test('instantiation; advance and reset', () => {
    expect(() => {
        const INVALID_STEP = 0;
        const linearProgression = new LinearProgression_1.LinearProgression(INVALID_STEP);
    }).toThrow();
    const VALID_STEP = 1;
    const linearProgression = new LinearProgression_1.LinearProgression(VALID_STEP);
    expect(linearProgression).toBeInstanceOf(LinearProgression_1.LinearProgression);
    expect(linearProgression.value).toBe(0);
    linearProgression.Advance();
    expect(linearProgression.value).toBe(VALID_STEP);
    linearProgression.Advance();
    expect(linearProgression.value).toBe(2 * VALID_STEP);
    linearProgression.Reset();
    expect(linearProgression.value).toBe(0);
});
//# sourceMappingURL=LinearProgression.test.js.map