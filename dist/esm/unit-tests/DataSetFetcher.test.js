'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DataSet, DataSetFetcher } from '../src/main';
describe('instantiation', () => {
    test('creation w/ random strings', () => {
        expect(new DataSetFetcher(['0', '1', '2', '3'])).toBeInstanceOf(DataSetFetcher);
    });
    test('creation w/ extra strings (supported)', () => {
        expect(new DataSetFetcher(['0', '1', '2', '3', '4'])).toBeInstanceOf(DataSetFetcher);
    });
    test('under-count throws', () => {
        expect(() => {
            new DataSetFetcher(['0', '1', '2']);
        }).toThrow();
    });
    test('duplicate paths throw', () => {
        expect(() => {
            new DataSetFetcher(['0', '1', '2', '2']);
        }).toThrow();
    });
});
describe('async file retrieval', () => {
    const PATH_INPUTS = 'data_inputs.txt';
    const PATH_TARGETS = 'data_targets.txt';
    const PATH_INVALID = 'should not exist.bad';
    test('fetches files and returns a DataSet', () => __awaiter(void 0, void 0, void 0, function* () {
        const dataSetFetcher = new DataSetFetcher(['n/a', 'n/a', PATH_INPUTS, PATH_TARGETS]);
        try {
            const dataSet = yield dataSetFetcher.Fetch();
            expect(dataSet).toBeInstanceOf(DataSet);
        }
        catch (e) {
            console.log('file fetch threw', e);
        }
    }));
    test('throws on bad inputs path', () => __awaiter(void 0, void 0, void 0, function* () {
        const dataSetFetcher = new DataSetFetcher(['n/a', 'n/a', PATH_INVALID, PATH_TARGETS]);
        try {
            expect(yield dataSetFetcher.Fetch()).toThrow();
        }
        catch (e) {
            console.log('jest forced error', e);
        }
    }));
    test('throws on bad targets path', () => __awaiter(void 0, void 0, void 0, function* () {
        const dataSetFetcher = new DataSetFetcher(['n/a', 'n/a', PATH_INPUTS, PATH_INVALID]);
        try {
            expect(yield dataSetFetcher.Fetch()).toThrow();
        }
        catch (e) {
            console.log('jest forced error', e);
        }
    }));
});
//# sourceMappingURL=DataSetFetcher.test.js.map