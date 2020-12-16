/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
import { GridOptions } from '../src/main';
test('instantiation argument', () => {
    // empty objects are fine
    const gridOptionsEmptyObject = new GridOptions({});
    expect(gridOptionsEmptyObject).toBeInstanceOf(GridOptions);
    // partial objects are fine
    const gridOptionsValid = new GridOptions({
        epochStatsDepth: 1
    });
    expect(gridOptionsValid).toBeInstanceOf(GridOptions);
    // unknown keys are fatal
    expect(() => {
        const gridOptionsInvalid = new GridOptions({
            unknownAxis: 1
        });
    }).toThrowError();
});
describe('user supplied values', () => {
    test('epochStatsDepth not a number', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                epochStatsDepth: 'non-number',
                repetitions: 2,
                validationSetSizeMin: 1000,
                writeResultsToDirectory: ''
            });
        }).toThrowError();
    });
    test('epochStatsDepth not a positive integer', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                epochStatsDepth: 0,
                repetitions: 2,
                validationSetSizeMin: 1000,
                writeResultsToDirectory: ''
            });
        }).toThrowError();
    });
    test('repetitions not a number', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                epochStatsDepth: 3,
                repetitions: 'non-number',
                validationSetSizeMin: 1000,
                writeResultsToDirectory: ''
            });
        }).toThrowError();
    });
    test('repetitions not a positive integer', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                epochStatsDepth: 3,
                repetitions: 0,
                validationSetSizeMin: 1000,
                writeResultsToDirectory: ''
            });
        }).toThrowError();
    });
    test('validationSetSizeMin not a number', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                epochStatsDepth: 3,
                repetitions: 2,
                validationSetSizeMin: 'non-number',
                writeResultsToDirectory: ''
            });
        }).toThrowError();
    });
    test('validationSetSizeMin not a positive integer', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                epochStatsDepth: 3,
                repetitions: 2,
                validationSetSizeMin: 0,
                writeResultsToDirectory: ''
            });
        }).toThrowError();
    });
    test('writeResultsToDirectory not a string', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                epochStatsDepth: 3,
                repetitions: 2,
                validationSetSizeMin: 1000,
                writeResultsToDirectory: false
            });
        }).toThrowError();
    });
    test('writeResultsToDirectory path does not exist', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                epochStatsDepth: 3,
                repetitions: 2,
                validationSetSizeMin: 1000,
                writeResultsToDirectory: 'j:/folder/nothing'
            });
        }).toThrowError();
    });
    test('writeResultsToDirectory path is not a directory', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                epochStatsDepth: 3,
                repetitions: 2,
                validationSetSizeMin: 1000,
                writeResultsToDirectory: 'README.md'
            });
        }).toThrowError();
    });
});
test('GetOption returns all types, and throws', () => {
    //TODO: These will be pulled from GridOptions (once they're defined).
    // const DEFAULT_EPOCH_STATS_DEPTH = 5;
    // const DEFAULT_REPETITIONS = 1;
    // const DEFAULT_VALIDATION_SET_SIZE_MIN = 100;
    // const DEFAULT_WRITE_RESULTS_TO_DIRECTORY = '';
    const gridOptionsDefaults = new GridOptions({
        epochStatsDepth: GridOptions.DEFAULT_EPOCH_STATS_DEPTH,
        repetitions: GridOptions.DEFAULT_REPETITIONS,
        validationSetSizeMin: GridOptions.DEFAULT_VALIDATION_SET_SIZE_MIN,
        writeResultsToDirectory: GridOptions.DEFAULT_WRITE_RESULTS_TO_DIRECTORY
    });
    expect(gridOptionsDefaults.GetOption('epochStatsDepth')).toBe(GridOptions.DEFAULT_EPOCH_STATS_DEPTH);
    expect(gridOptionsDefaults.GetOption('repetitions')).toBe(GridOptions.DEFAULT_REPETITIONS);
    expect(gridOptionsDefaults.GetOption('validationSetSizeMin')).toBe(GridOptions.DEFAULT_VALIDATION_SET_SIZE_MIN);
    expect(gridOptionsDefaults.GetOption('writeResultsToDirectory')).toBe(GridOptions.DEFAULT_WRITE_RESULTS_TO_DIRECTORY);
    // check an empty key
    expect(() => { gridOptionsDefaults.GetOption(''); }).toThrowError();
    // check an unknown key
    expect(() => { gridOptionsDefaults.GetOption('unknownKey'); }).toThrowError();
    const CUSTOM_EPOCH_STATS_DEPTH = 10;
    const CUSTOM_REPETITIONS = 5;
    const CUSTOM_VALIDATION_SET_SIZE_MIN = 20;
    const CUSTOM_WRITE_RESULTS_TO_DIRECTORY = 'c:/';
    const gridOptionsCustom = new GridOptions({
        epochStatsDepth: CUSTOM_EPOCH_STATS_DEPTH,
        repetitions: CUSTOM_REPETITIONS,
        validationSetSizeMin: CUSTOM_VALIDATION_SET_SIZE_MIN,
        writeResultsToDirectory: CUSTOM_WRITE_RESULTS_TO_DIRECTORY
    });
    expect(gridOptionsCustom.GetOption('epochStatsDepth')).toBe(CUSTOM_EPOCH_STATS_DEPTH);
    expect(gridOptionsCustom.GetOption('repetitions')).toBe(CUSTOM_REPETITIONS);
    expect(gridOptionsCustom.GetOption('validationSetSizeMin')).toBe(CUSTOM_VALIDATION_SET_SIZE_MIN);
    expect(gridOptionsCustom.GetOption('writeResultsToDirectory')).toBe(CUSTOM_WRITE_RESULTS_TO_DIRECTORY);
});
//# sourceMappingURL=GridOptions.test.js.map