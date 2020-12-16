/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
const VALID_DELTA_CORRECT = 0;
const VALID_DELTA_INCORRECT = 0;
const VALID_TOTAL_CASES = 2;
const VALID_TOTAL_CORRECT = 1;
test('instantiation w valid args; calculate score', () => {
    const modelTestStats = new main_1.ModelTestStats(VALID_DELTA_CORRECT, VALID_DELTA_INCORRECT, VALID_TOTAL_CORRECT, VALID_TOTAL_CASES);
    expect(modelTestStats).toBeInstanceOf(main_1.ModelTestStats);
    expect(modelTestStats.CalculateScore()).toBe(VALID_TOTAL_CORRECT / VALID_TOTAL_CASES);
});
test('instantiation throws on float correct', () => {
    expect(() => {
        const modelTestStats = new main_1.ModelTestStats(VALID_DELTA_CORRECT, VALID_DELTA_INCORRECT, 1.5, VALID_TOTAL_CASES);
    }).toThrow();
});
test('instantiation throws on too many correct', () => {
    expect(() => {
        const modelTestStats = new main_1.ModelTestStats(VALID_DELTA_CORRECT, VALID_DELTA_INCORRECT, 1 + VALID_TOTAL_CASES, VALID_TOTAL_CASES);
    }).toThrow();
});
test('instantiation throws on float cases', () => {
    expect(() => {
        const modelTestStats = new main_1.ModelTestStats(VALID_DELTA_CORRECT, VALID_DELTA_INCORRECT, VALID_DELTA_CORRECT, 2.5);
    }).toThrow();
});
test('instantiation throws on too few cases', () => {
    expect(() => {
        const modelTestStats = new main_1.ModelTestStats(VALID_DELTA_CORRECT, VALID_DELTA_INCORRECT, VALID_DELTA_CORRECT, 0);
    }).toThrow();
});
//# sourceMappingURL=ModelTestStats.test.js.map