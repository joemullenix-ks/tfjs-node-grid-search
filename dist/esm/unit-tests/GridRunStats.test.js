'use strict';
import { EpochStats, GridRunStats, IterationResult, ModelParams, ModelTestStats } from '../src/main';
test('instantiation', () => {
    const gridRunStats = new GridRunStats();
    expect(gridRunStats).toBeInstanceOf(GridRunStats);
});
test('adding an iteration result and write reports', () => {
    const epochStats = new EpochStats(1);
    const modelParams = new ModelParams({}, {});
    const modelTestStats = new ModelTestStats(0, 0, 0, 1);
    const iterationResult = new IterationResult(1, 'descriptor', epochStats, modelParams, modelTestStats, 2, 3);
    const gridRunStats = new GridRunStats();
    // write these reports while the _iterationResults array is empty
    expect(gridRunStats.WriteCSV()).toBe(GridRunStats._noData);
    expect(gridRunStats.WriteReport(true)).toBe('');
    expect(gridRunStats.WriteReport(false)).toBe('');
    // and an entry to the _iterationResults array...
    expect(gridRunStats.AddIterationResult(iterationResult)).toBe(undefined);
    // ...and write the reports again
    expect(gridRunStats.WriteCSV()).not.toBe(GridRunStats._noData);
    expect(gridRunStats.WriteCSV()).not.toBe('');
    expect(typeof gridRunStats.WriteCSV()).toBe('string');
    expect(typeof gridRunStats.WriteReport(true)).toBe('string');
    expect(typeof gridRunStats.WriteReport(false)).toBe('string');
    expect(gridRunStats.WriteReport(true)).not.toBe('');
    expect(gridRunStats.WriteReport(false)).not.toBe('');
});
//# sourceMappingURL=GridRunStats.test.js.map