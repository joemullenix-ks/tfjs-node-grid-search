/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../../src/main");
test('instantiation; advance and reset', () => {
    expect(() => {
        const INVALID_BASE = 1;
        const exponentialProgression = new main_1.ExponentialProgression(INVALID_BASE, 1);
    }).toThrow();
    expect(() => {
        const INVALID_SCALE = -1;
        const exponentialProgression = new main_1.ExponentialProgression(2, INVALID_SCALE);
    }).toThrow();
    const exponentialProgression = new main_1.ExponentialProgression(2, 1);
    expect(exponentialProgression).toBeInstanceOf(main_1.ExponentialProgression);
    expect(exponentialProgression.value).toBe(0);
    exponentialProgression.Advance();
    expect(exponentialProgression.value).toBe(1);
    exponentialProgression.Advance();
    expect(exponentialProgression.value).toBe(2);
    exponentialProgression.Advance();
    expect(exponentialProgression.value).toBe(4);
    exponentialProgression.Advance();
    expect(exponentialProgression.value).toBe(8);
    exponentialProgression.Reset();
    expect(exponentialProgression.value).toBe(0);
});
//# sourceMappingURL=ExponentialProgression.test.js.map