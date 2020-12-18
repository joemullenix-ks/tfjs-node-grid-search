'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
test('instantiation', () => {
    const gridRunStats = new main_1.GridRunStats();
    expect(gridRunStats).toBeInstanceOf(main_1.GridRunStats);
});
test('adding an iteration result and writing reports', () => {
    const epochStats = new main_1.EpochStats(1);
    const modelParams = new main_1.ModelParams({}, {});
    const modelTestStatsA = new main_1.ModelTestStats(0, 0, 0, 1);
    const iterationResultA = new main_1.IterationResult(1, 'descriptorA', epochStats, modelParams, modelTestStatsA, 2, 3);
    const gridRunStats = new main_1.GridRunStats();
    // write these reports while the _iterationResults array is empty
    expect(gridRunStats.WriteCSV()).toBe(main_1.GridRunStats._noData);
    expect(gridRunStats.WriteReport(true)).toBe('');
    expect(gridRunStats.WriteReport(false)).toBe('');
    // and an entry to the _iterationResults array...
    expect(gridRunStats.AddIterationResult(iterationResultA)).toBe(undefined);
    // ...and write the reports again
    expect(gridRunStats.WriteCSV()).not.toBe(main_1.GridRunStats._noData);
    expect(gridRunStats.WriteCSV()).not.toBe('');
    expect(typeof gridRunStats.WriteCSV()).toBe('string');
    expect(typeof gridRunStats.WriteReport(true)).toBe('string');
    expect(typeof gridRunStats.WriteReport(false)).toBe('string');
    expect(gridRunStats.WriteReport(true)).not.toBe('');
    expect(gridRunStats.WriteReport(false)).not.toBe('');
    // and another entry, and re-run the reports (need > 1 for sorting)
    const modelTestStatsB = new main_1.ModelTestStats(2, 2, 2, 2);
    const iterationResultB = new main_1.IterationResult(2, 'descriptorB', epochStats, modelParams, modelTestStatsB, 4, 5);
    expect(gridRunStats.AddIterationResult(iterationResultB)).toBe(undefined);
    expect(gridRunStats.WriteReport(true)).not.toBe('');
    expect(gridRunStats.WriteReport(false)).not.toBe('');
});
//# sourceMappingURL=GridRunStats.test.js.map