'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
test('instantiation', () => {
    const gridRunStats = new main_1.GridRunStats();
    expect(gridRunStats).toBeInstanceOf(main_1.GridRunStats);
});
test('adding an iteration result and write reports', () => {
    const epochStats = new main_1.EpochStats(0);
    const modelParams = new main_1.ModelParams({}, {});
    const modelTestStats = new main_1.ModelTestStats(0, 0, 0, 1);
    const iterationResult = new main_1.IterationResult(1, 'descriptor', epochStats, modelParams, modelTestStats, 2, 3);
    const gridRunStats = new main_1.GridRunStats();
    // write these reports while the _iterationResults array is empty
    expect(gridRunStats.WriteCSV()).toBe(main_1.GridRunStats._noData);
    expect(gridRunStats.WriteReport(true)).toBe('');
    expect(gridRunStats.WriteReport(false)).toBe('');
    // and an entry to the _iterationResults array...
    expect(gridRunStats.AddIterationResult(iterationResult)).toBe(undefined);
    // ...and write the reports again
    expect(gridRunStats.WriteCSV()).not.toBe(main_1.GridRunStats._noData);
    expect(gridRunStats.WriteCSV()).not.toBe('');
    expect(typeof gridRunStats.WriteCSV()).toBe('string');
    expect(typeof gridRunStats.WriteReport(true)).toBe('string');
    expect(typeof gridRunStats.WriteReport(false)).toBe('string');
    expect(gridRunStats.WriteReport(true)).not.toBe('');
    expect(gridRunStats.WriteReport(false)).not.toBe('');
});
//# sourceMappingURL=GridRunStats.test.js.map