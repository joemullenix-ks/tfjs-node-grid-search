/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const FibonacciProgression_1 = require("../../src/lib/progression/FibonacciProgression");
test('instantiation; advance and reset', () => {
    expect(() => {
        const INVALID_INITIATOR = -1;
        const fibonacciProgression = new FibonacciProgression_1.FibonacciProgression(INVALID_INITIATOR);
    }).toThrow();
    const fibonacciProgression = new FibonacciProgression_1.FibonacciProgression(0);
    expect(fibonacciProgression).toBeInstanceOf(FibonacciProgression_1.FibonacciProgression);
    expect(fibonacciProgression.value).toBe(0);
    fibonacciProgression.Advance();
    expect(fibonacciProgression.value).toBe(1);
    fibonacciProgression.Advance();
    expect(fibonacciProgression.value).toBe(2);
    fibonacciProgression.Advance();
    expect(fibonacciProgression.value).toBe(3);
    fibonacciProgression.Advance();
    expect(fibonacciProgression.value).toBe(5);
    fibonacciProgression.Reset();
    expect(fibonacciProgression.value).toBe(0);
});
test('float rounds to proper value', () => {
    const fibonacciProgression = new FibonacciProgression_1.FibonacciProgression(2.5);
    expect(fibonacciProgression).toBeInstanceOf(FibonacciProgression_1.FibonacciProgression);
    expect(fibonacciProgression.value).toBe(0);
    fibonacciProgression.Advance();
    expect(fibonacciProgression.value).toBe(3);
    fibonacciProgression.Advance();
    expect(fibonacciProgression.value).toBe(5);
});
test('midpoint falls to proper value', () => {
    const fibonacciProgression = new FibonacciProgression_1.FibonacciProgression(10);
    expect(fibonacciProgression).toBeInstanceOf(FibonacciProgression_1.FibonacciProgression);
    expect(fibonacciProgression.value).toBe(0);
    fibonacciProgression.Advance();
    expect(fibonacciProgression.value).toBe(8);
    fibonacciProgression.Advance();
    expect(fibonacciProgression.value).toBe(13);
});
test('midpoint rises to proper value', () => {
    const fibonacciProgression = new FibonacciProgression_1.FibonacciProgression(11);
    expect(fibonacciProgression).toBeInstanceOf(FibonacciProgression_1.FibonacciProgression);
    expect(fibonacciProgression.value).toBe(0);
    fibonacciProgression.Advance();
    expect(fibonacciProgression.value).toBe(13);
    fibonacciProgression.Advance();
    expect(fibonacciProgression.value).toBe(21);
});
//# sourceMappingURL=FibonacciProgression.test.js.map