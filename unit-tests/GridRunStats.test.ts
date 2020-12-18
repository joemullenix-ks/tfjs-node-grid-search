'use strict';


import { EpochStats, GridRunStats, IterationResult, ModelParams, ModelTestStats } from '../src/main';


test('instantiation', () => {
  const gridRunStats = new GridRunStats();

  expect(gridRunStats).toBeInstanceOf(GridRunStats);
});

test('adding an iteration result and writing reports', () => {
  const epochStats = new EpochStats(1);

  const modelParams = new ModelParams({}, {});

  const modelTestStatsA = new ModelTestStats(0, 0, 0, 1);

  const iterationResultA = new IterationResult(	1,
                                                'descriptorA',
                                                epochStats,
                                                modelParams,
                                                modelTestStatsA,
                                                2,
                                                3);

  const gridRunStats = new GridRunStats();

  // write these reports while the _iterationResults array is empty

  expect(gridRunStats.WriteCSV()).toBe(GridRunStats._noData);

  expect(gridRunStats.WriteReport(true)).toBe('');
  expect(gridRunStats.WriteReport(false)).toBe('');

  // and an entry to the _iterationResults array...

  expect(gridRunStats.AddIterationResult(iterationResultA)).toBe(undefined);

  // ...and write the reports again

  expect(gridRunStats.WriteCSV()).not.toBe(GridRunStats._noData);
  expect(gridRunStats.WriteCSV()).not.toBe('');
  expect(typeof gridRunStats.WriteCSV()).toBe('string');

  expect(typeof gridRunStats.WriteReport(true)).toBe('string');
  expect(typeof gridRunStats.WriteReport(false)).toBe('string');
  expect(gridRunStats.WriteReport(true)).not.toBe('');
  expect(gridRunStats.WriteReport(false)).not.toBe('');

  // and another entry, and re-run the reports (need > 1 for sorting)

  const modelTestStatsB = new ModelTestStats(2, 2, 2, 2);

  const iterationResultB = new IterationResult(	2,
                                                'descriptorB',
                                                epochStats,
                                                modelParams,
                                                modelTestStatsB,
                                                4,
                                                5);

  expect(gridRunStats.AddIterationResult(iterationResultB)).toBe(undefined);

  expect(gridRunStats.WriteReport(true)).not.toBe('');
  expect(gridRunStats.WriteReport(false)).not.toBe('');
});
