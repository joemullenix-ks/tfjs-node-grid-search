/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
const VALID_DESCRIPTOR = 'desc';
test('instantiation; readonlys', () => {
    const epochStats = new main_1.EpochStats(1);
    const modelParams = new main_1.ModelParams({}, {});
    const modelTestStats = new main_1.ModelTestStats(0, 0, 0, 1);
    const iterationResult = new main_1.IterationResult(1, VALID_DESCRIPTOR, epochStats, modelParams, modelTestStats, 2, 3);
    expect(iterationResult).toBeInstanceOf(main_1.IterationResult);
    expect(iterationResult.iteration).toBe(1);
    expect(iterationResult.repetition).toBe(2);
    expect(iterationResult.runDuration).toBe(3);
    expect(iterationResult.score).toBe(0);
});
test('bad instantiations throw', () => {
    const epochStats = new main_1.EpochStats(1);
    const modelParams = new main_1.ModelParams({}, {});
    const modelTestStats = new main_1.ModelTestStats(0, 0, 0, 1);
    // negative iteration
    expect(() => {
        const iterationResult = new main_1.IterationResult(-1, VALID_DESCRIPTOR, epochStats, modelParams, modelTestStats, 0, 0);
    }).toThrow();
    // float iteration
    expect(() => {
        const iterationResult = new main_1.IterationResult(0.5, VALID_DESCRIPTOR, epochStats, modelParams, modelTestStats, 0, 0);
    }).toThrow();
    // empty string descriptor
    expect(() => {
        const iterationResult = new main_1.IterationResult(0, '', epochStats, modelParams, modelTestStats, 0, 0);
    }).toThrow();
    // negative repetition
    expect(() => {
        const iterationResult = new main_1.IterationResult(0, VALID_DESCRIPTOR, epochStats, modelParams, modelTestStats, -1, 0);
    }).toThrow();
    // float repetition
    expect(() => {
        const iterationResult = new main_1.IterationResult(0, VALID_DESCRIPTOR, epochStats, modelParams, modelTestStats, 0.5, 0);
    }).toThrow();
    // negative duration
    expect(() => {
        const iterationResult = new main_1.IterationResult(0, VALID_DESCRIPTOR, epochStats, modelParams, modelTestStats, 0, -1);
    }).toThrow();
    // float duration
    expect(() => {
        const iterationResult = new main_1.IterationResult(0, VALID_DESCRIPTOR, epochStats, modelParams, modelTestStats, 0, 0.5);
    }).toThrow();
});
test('CSV header & body write helpers', () => {
    const epochStats = new main_1.EpochStats(1);
    const modelParams = new main_1.ModelParams({}, {});
    const modelTestStats = new main_1.ModelTestStats(0, 0, 0, 1);
    const iterationResult = new main_1.IterationResult(1, VALID_DESCRIPTOR, epochStats, modelParams, modelTestStats, 2, 3);
    expect(typeof iterationResult.WriteEpochStatsHeader()).toBe('string');
    expect(typeof iterationResult.WriteEpochStatsValues()).toBe('string');
    expect(typeof iterationResult.WriteModelParamHeader()).toBe('string');
    expect(typeof iterationResult.WriteModelParamValues()).toBe('string');
    expect(typeof iterationResult.WriteTestStatsHeader()).toBe('string');
    expect(typeof iterationResult.WriteTestStatsValues()).toBe('string');
    expect(typeof iterationResult.WriteReport()).toBe('string');
});
//# sourceMappingURL=IterationResult.test.js.map