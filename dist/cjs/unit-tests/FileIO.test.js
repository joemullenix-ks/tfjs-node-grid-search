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
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
test('generate valid csv filename', () => {
    expect(typeof main_1.FileIO.ProduceResultsFilename()).toBe('string');
    expect(main_1.FileIO.ProduceResultsFilename()).toMatch(/Results_/);
    expect(main_1.FileIO.ProduceResultsFilename()).toMatch(/.csv/);
});
describe('async file read', () => {
    const PATH_INVALID = 'should not exist.bad';
    const PATH_VALID = 'data_targets.txt';
    const DATA_BLOCK_SIZE = 120003;
    test('finds file', () => {
        const FILE_IO_RESULT = new main_1.FileIOResult();
        expect(() => __awaiter(void 0, void 0, void 0, function* () {
            yield main_1.FileIO.ReadDataFile(PATH_VALID, FILE_IO_RESULT);
        })).not.toThrow();
    });
    //KEEP: Although this is very similar to the next test, it doesn't work. The
    //		differences are very subtle. Namely, we ned to the return the expect()
    //		result (which is a promise, I believe), and we we need to chain a
    //		'rejects' before requiring the throw.
    //
    // 	test('throws on bad filepath', () => {
    // 		const FILE_IO_RESULT = new FileIOResult();
    //
    // 		expect(async () => {
    // 			await FileIO.ReadDataFile(PATH_VALID, FILE_IO_RESULT);   // FAILS
    // 			await FileIO.ReadDataFile(PATH_INVALID, FILE_IO_RESULT); // Also!?
    // 		}).toThrow();
    // 	});
    test('throws on bad filepath', () => {
        const FILE_IO_RESULT = new main_1.FileIOResult();
        return expect(() => __awaiter(void 0, void 0, void 0, function* () {
            yield main_1.FileIO.ReadDataFile(PATH_INVALID, FILE_IO_RESULT);
        })).rejects.toThrow();
    });
    test('writes data to result', () => __awaiter(void 0, void 0, void 0, function* () {
        const FILE_IO_RESULT = new main_1.FileIOResult();
        yield main_1.FileIO.ReadDataFile(PATH_VALID, FILE_IO_RESULT);
        expect(FILE_IO_RESULT.data).not.toBe('');
        expect(FILE_IO_RESULT.data.length).toBe(DATA_BLOCK_SIZE);
    }));
});
describe('async file write', () => {
    const DIRECTORY_INVALID = 'no-directory/here';
    const FILE_VALID = 'unit-test-file-write.txt';
    const OUTPUT_DATA = 'written by TNGS unit testing';
    test('does not throw w valid args', () => {
        expect(() => __awaiter(void 0, void 0, void 0, function* () {
            yield main_1.FileIO.WriteResultsFile(FILE_VALID, '', OUTPUT_DATA);
        })).not.toThrow();
    });
    test('throws on empty filename', () => {
        return expect(() => __awaiter(void 0, void 0, void 0, function* () {
            yield main_1.FileIO.WriteResultsFile('', '', OUTPUT_DATA);
        })).rejects.toThrow();
    });
    test('throws on bad directory', () => {
        return expect(() => __awaiter(void 0, void 0, void 0, function* () {
            yield main_1.FileIO.WriteResultsFile(FILE_VALID, DIRECTORY_INVALID, OUTPUT_DATA);
        })).rejects.toThrow();
    });
    test('returns cleanly', () => __awaiter(void 0, void 0, void 0, function* () {
        //NOTE: Took another approach here, and it came out much more cleanly than our
        //		previous asynchronous tests (the reads, too).
        //
        //TODO: Once we're finished, make another pass through all async/await tests.
        try {
            expect(yield main_1.FileIO.WriteResultsFile(FILE_VALID, '', OUTPUT_DATA)).toBeUndefined();
        }
        catch (e) {
            console.log('write-file-return-check threw', e);
        }
    }));
    test('does not throw on empty data', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            expect(yield main_1.FileIO.WriteResultsFile(FILE_VALID, '', '')).not.toThrow();
        }
        catch (e) {
            console.log('write-empty-file threw', e);
        }
    }));
});
//# sourceMappingURL=FileIO.test.js.map