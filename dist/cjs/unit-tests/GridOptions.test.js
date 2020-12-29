/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
describe('instantiation argument', () => {
    test('empty objects are fine', () => {
        const gridOptionsEmptyObject = new main_1.GridOptions({});
        expect(gridOptionsEmptyObject).toBeInstanceOf(main_1.GridOptions);
    });
    test('partial objects are fine', () => {
        const gridOptionsValid = new main_1.GridOptions({
            epochStatsDepth: 1
        });
        expect(gridOptionsValid).toBeInstanceOf(main_1.GridOptions);
    });
    test('unknown keys are fatal', () => {
        expect(() => {
            const gridOptionsInvalid = new main_1.GridOptions({
                unknownAxis: 1
            });
        }).toThrowError();
    });
});
describe('user supplied values', () => {
    test('epochStatsDepth not a number', () => {
        expect(() => {
            const gridOptions = new main_1.GridOptions({
                epochStatsDepth: 'non-number'
            });
        }).toThrowError();
    });
    test('epochStatsDepth not a positive integer', () => {
        expect(() => {
            const gridOptions = new main_1.GridOptions({
                epochStatsDepth: 0
            });
        }).toThrowError();
    });
    test('repetitions not a number', () => {
        expect(() => {
            const gridOptions = new main_1.GridOptions({
                repetitions: 'non-number'
            });
        }).toThrowError();
    });
    test('repetitions not a positive integer', () => {
        expect(() => {
            const gridOptions = new main_1.GridOptions({
                repetitions: 0
            });
        }).toThrowError();
    });
    test('resultsDirectory not a string', () => {
        expect(() => {
            const gridOptions = new main_1.GridOptions({
                resultsDirectory: false
            });
        }).toThrowError();
    });
    test('resultsDirectory path does not exist', () => {
        expect(() => {
            const gridOptions = new main_1.GridOptions({
                resultsDirectory: 'j:/folder/nothing'
            });
        }).toThrowError();
    });
    test('resultsDirectory path is not a directory', () => {
        expect(() => {
            const gridOptions = new main_1.GridOptions({
                resultsDirectory: 'README.md'
            });
        }).toThrowError();
    });
    test('validationSetSizeMin not a number', () => {
        expect(() => {
            const gridOptions = new main_1.GridOptions({
                validationSetSizeMin: 'non-number'
            });
        }).toThrowError();
    });
    test('validationSetSizeMin not a positive integer', () => {
        expect(() => {
            const gridOptions = new main_1.GridOptions({
                validationSetSizeMin: 0
            });
        }).toThrowError();
    });
    test('writeResultsAsCSV not a boolean', () => {
        expect(() => {
            const gridOptions = new main_1.GridOptions({
                writeResultsAsCSV: 0
            });
        }).toThrowError();
    });
});
test('GetOption returns all types, and throws', () => {
    const gridOptionsDefaults = new main_1.GridOptions({
        epochStatsDepth: main_1.GridOptions.DEFAULT_EPOCH_STATS_DEPTH,
        repetitions: main_1.GridOptions.DEFAULT_REPETITIONS,
        resultsDirectory: main_1.GridOptions.DEFAULT_RESULTS_DIRECTORY,
        validationSetSizeMin: main_1.GridOptions.DEFAULT_VALIDATION_SET_SIZE_MIN,
        writeResultsAsCSV: main_1.GridOptions.DEFAULT_WRITE_RESULTS_AS_CSV
    });
    expect(gridOptionsDefaults.GetOption('epochStatsDepth')).toBe(main_1.GridOptions.DEFAULT_EPOCH_STATS_DEPTH);
    expect(gridOptionsDefaults.GetOption('repetitions')).toBe(main_1.GridOptions.DEFAULT_REPETITIONS);
    expect(gridOptionsDefaults.GetOption('resultsDirectory')).toBe(main_1.GridOptions.DEFAULT_RESULTS_DIRECTORY);
    expect(gridOptionsDefaults.GetOption('validationSetSizeMin')).toBe(main_1.GridOptions.DEFAULT_VALIDATION_SET_SIZE_MIN);
    expect(gridOptionsDefaults.GetOption('writeResultsAsCSV')).toBe(main_1.GridOptions.DEFAULT_WRITE_RESULTS_AS_CSV);
    // confirm the null object gets filled w/ the class defaults
    const gridOptionsEmpty = new main_1.GridOptions({});
    expect(gridOptionsEmpty.GetOption('epochStatsDepth')).toBe(main_1.GridOptions.DEFAULT_EPOCH_STATS_DEPTH);
    expect(gridOptionsEmpty.GetOption('repetitions')).toBe(main_1.GridOptions.DEFAULT_REPETITIONS);
    expect(gridOptionsEmpty.GetOption('resultsDirectory')).toBe(main_1.GridOptions.DEFAULT_RESULTS_DIRECTORY);
    expect(gridOptionsEmpty.GetOption('validationSetSizeMin')).toBe(main_1.GridOptions.DEFAULT_VALIDATION_SET_SIZE_MIN);
    expect(gridOptionsEmpty.GetOption('writeResultsAsCSV')).toBe(main_1.GridOptions.DEFAULT_WRITE_RESULTS_AS_CSV);
    // check an empty key
    expect(() => { gridOptionsDefaults.GetOption(''); }).toThrowError();
    // check an unknown key
    expect(() => { gridOptionsDefaults.GetOption('unknownKey'); }).toThrowError();
    // check non-default keys
    const CUSTOM_EPOCH_STATS_DEPTH = 10;
    const CUSTOM_REPETITIONS = 5;
    const CUSTOM_RESULTS_DIRECTORY = 'c:/';
    const CUSTOM_VALIDATION_SET_SIZE_MIN = 20;
    const CUSTOM_WRITE_RESULTS_AS_CSV = false;
    const gridOptionsCustom = new main_1.GridOptions({
        epochStatsDepth: CUSTOM_EPOCH_STATS_DEPTH,
        repetitions: CUSTOM_REPETITIONS,
        resultsDirectory: CUSTOM_RESULTS_DIRECTORY,
        validationSetSizeMin: CUSTOM_VALIDATION_SET_SIZE_MIN,
        writeResultsAsCSV: CUSTOM_WRITE_RESULTS_AS_CSV
    });
    expect(gridOptionsCustom.GetOption('epochStatsDepth')).toBe(CUSTOM_EPOCH_STATS_DEPTH);
    expect(gridOptionsCustom.GetOption('repetitions')).toBe(CUSTOM_REPETITIONS);
    expect(gridOptionsCustom.GetOption('resultsDirectory')).toBe(CUSTOM_RESULTS_DIRECTORY);
    expect(gridOptionsCustom.GetOption('validationSetSizeMin')).toBe(CUSTOM_VALIDATION_SET_SIZE_MIN);
    expect(gridOptionsCustom.GetOption('writeResultsAsCSV')).toBe(CUSTOM_WRITE_RESULTS_AS_CSV);
});
//# sourceMappingURL=GridOptions.test.js.map