/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';


import { GridOptions } from '../src/main';


describe('instantiation argument', () => {
    test('empty objects are fine', () => {
        const gridOptionsEmptyObject = new GridOptions({});

        expect(gridOptionsEmptyObject).toBeInstanceOf(GridOptions);
    });

    test('partial objects are fine', () => {
        const gridOptionsValid = new GridOptions({
            epochStatsDepth: 1
        });

        expect(gridOptionsValid).toBeInstanceOf(GridOptions);
    });

    test('unknown keys are fatal', () => {
        expect(() => {
            const gridOptionsInvalid = new GridOptions({
                unknownAxis: 1
            });
        }).toThrowError();
    });
});

describe('user supplied values', () => {
    test('epochStatsDepth not a number', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                epochStatsDepth: 'non-number'
            });
        }).toThrowError();
    });

    test('epochStatsDepth not a positive integer', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                epochStatsDepth: 0
            });
        }).toThrowError();
    });

    test('repetitions not a number', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                repetitions: 'non-number'
            });
        }).toThrowError();
    });

    test('repetitions not a positive integer', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                repetitions: 0
            });
        }).toThrowError();
    });

    test('resultsDirectory not a string', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                resultsDirectory: false
            });
        }).toThrowError();
    });

    test('resultsDirectory path does not exist', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                resultsDirectory: 'j:/folder/nothing'
            });
        }).toThrowError();
    });

    test('resultsDirectory path is not a directory', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                resultsDirectory: 'README.md'
            });
        }).toThrowError();
    });

    test('validationSetSizeMin not a number', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                validationSetSizeMin: 'non-number'
            });
        }).toThrowError();
    });

    test('validationSetSizeMin not a positive integer', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                validationSetSizeMin: 0
            });
        }).toThrowError();
    });

    test('writeResultsAsCSV not a boolean', () => {
        expect(() => {
            const gridOptions = new GridOptions({
                writeResultsAsCSV: 0
            });
        }).toThrowError();
    });
});

test('GetOption returns all types, and throws', () => {
    const gridOptionsDefaults = new GridOptions({
        epochStatsDepth: GridOptions.DEFAULT_EPOCH_STATS_DEPTH,
        repetitions: GridOptions.DEFAULT_REPETITIONS,
        resultsDirectory: GridOptions.DEFAULT_RESULTS_DIRECTORY,
        validationSetSizeMin: GridOptions.DEFAULT_VALIDATION_SET_SIZE_MIN,
        writeResultsAsCSV: GridOptions.DEFAULT_WRITE_RESULTS_AS_CSV
    });

    expect(gridOptionsDefaults.GetOption('epochStatsDepth')).toBe(GridOptions.DEFAULT_EPOCH_STATS_DEPTH);
    expect(gridOptionsDefaults.GetOption('repetitions')).toBe(GridOptions.DEFAULT_REPETITIONS);
    expect(gridOptionsDefaults.GetOption('resultsDirectory')).toBe(GridOptions.DEFAULT_RESULTS_DIRECTORY);
    expect(gridOptionsDefaults.GetOption('validationSetSizeMin')).toBe(GridOptions.DEFAULT_VALIDATION_SET_SIZE_MIN);
    expect(gridOptionsDefaults.GetOption('writeResultsAsCSV')).toBe(GridOptions.DEFAULT_WRITE_RESULTS_AS_CSV);

    // confirm the null object gets filled w/ the class defaults
    const gridOptionsEmpty = new GridOptions({});

    expect(gridOptionsEmpty.GetOption('epochStatsDepth')).toBe(GridOptions.DEFAULT_EPOCH_STATS_DEPTH);
    expect(gridOptionsEmpty.GetOption('repetitions')).toBe(GridOptions.DEFAULT_REPETITIONS);
    expect(gridOptionsEmpty.GetOption('resultsDirectory')).toBe(GridOptions.DEFAULT_RESULTS_DIRECTORY);
    expect(gridOptionsEmpty.GetOption('validationSetSizeMin')).toBe(GridOptions.DEFAULT_VALIDATION_SET_SIZE_MIN);
    expect(gridOptionsEmpty.GetOption('writeResultsAsCSV')).toBe(GridOptions.DEFAULT_WRITE_RESULTS_AS_CSV);

    // check an empty key
    expect(() => {gridOptionsDefaults.GetOption('');}).toThrowError();

    // check an unknown key
    expect(() => {gridOptionsDefaults.GetOption('unknownKey');}).toThrowError();

    // check non-default keys

    const CUSTOM_EPOCH_STATS_DEPTH = 10;
    const CUSTOM_REPETITIONS = 5;
    const CUSTOM_RESULTS_DIRECTORY = 'c:/';
    const CUSTOM_VALIDATION_SET_SIZE_MIN = 20;
    const CUSTOM_WRITE_RESULTS_AS_CSV = false;

    const gridOptionsCustom = new GridOptions({
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
