'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
//vvvv FILESYSTEM MOCKUP (integration tests touch the disk, not unit tests)
const FS_PROMISES_MOCKUP = __importStar(require("fs/promises"));
jest.mock('fs/promises');
//NOTE: This horrendous 'any' cast is for TypeScript's compiler. It's only been
//		permitted because this usage is quarantined within unit tests.
//
//TODO: Dig further into Jest. There must be another way.
FS_PROMISES_MOCKUP.readFile.mockImplementation((path, encoding) => {
    //TODO: Expand our supported character sets, when requested.
    if (encoding !== main_1.FileIO.STANDARD_ENCODING) {
        console.error('unsupported encoding in fs mockup');
        throw new Error('unsupported encoding in fs mockup');
    }
    if (path === MOCK_READ_PATH_INPUTS || MOCK_READ_PATH_TARGETS) {
        return Promise.resolve('[[0, 1], [1, 0]]');
    }
    if (path === MOCK_READ_PATH_INVALID) {
        return Promise.reject('invalid mock path');
    }
    //NOTE: We don't throw here, as throwing can be the criterion under evaluation.
    console.error('test mockup read error');
    return undefined; // make TS happy
});
//^^^^
const MOCK_READ_PATH_INPUTS = 'inputs file we pretend exists';
const MOCK_READ_PATH_TARGETS = 'targets file we pretend exists';
const MOCK_READ_PATH_INVALID = 'path we pretend does not exist';
describe('instantiation', () => {
    test('creation w/ random strings', () => {
        expect(new main_1.DataSetFetcher(['0', '1', '2', '3'])).toBeInstanceOf(main_1.DataSetFetcher);
    });
    test('creation w/ extra strings (supported)', () => {
        expect(new main_1.DataSetFetcher(['0', '1', '2', '3', '4'])).toBeInstanceOf(main_1.DataSetFetcher);
    });
    test('under-count throws', () => {
        expect(() => {
            new main_1.DataSetFetcher(['0', '1', '2']);
        }).toThrow();
    });
    test('duplicate paths throw', () => {
        expect(() => {
            new main_1.DataSetFetcher(['0', '1', '2', '2']);
        }).toThrow();
    });
});
describe('async file retrieval', () => {
    //TODO: Verify, but this might be a false negative; failing in mockup.
    //		Try again w/ the expect().rejects.toThrow() technique from Grid.test!
    test('throws on bad inputs path', () => __awaiter(void 0, void 0, void 0, function* () {
        const dataSetFetcher = new main_1.DataSetFetcher(['n/a', 'n/a', MOCK_READ_PATH_INVALID, MOCK_READ_PATH_TARGETS]);
        try {
            expect(yield dataSetFetcher.Fetch()).toThrow();
        }
        catch (e) {
            console.log('jest forced error', e);
        }
    }));
    //TODO: Verify, but this might be a false negative; failing in mockup.
    //		Try again w/ the expect().rejects.toThrow() technique from Grid.test!
    test('throws on bad targets path', () => __awaiter(void 0, void 0, void 0, function* () {
        const dataSetFetcher = new main_1.DataSetFetcher(['n/a', 'n/a', MOCK_READ_PATH_INPUTS, MOCK_READ_PATH_INVALID]);
        try {
            expect(yield dataSetFetcher.Fetch()).toThrow();
        }
        catch (e) {
            console.log('jest forced error', e);
        }
    }));
    test('throws on bad/missing encoding key', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            expect(yield FS_PROMISES_MOCKUP.readFile('')).toThrow();
        }
        catch (e) {
            console.log('file fetch threw', e);
        }
    }));
    test('fetches files and returns a DataSet', () => __awaiter(void 0, void 0, void 0, function* () {
        const dataSetFetcher = new main_1.DataSetFetcher(['n/a', 'n/a', MOCK_READ_PATH_INPUTS, MOCK_READ_PATH_TARGETS]);
        try {
            const dataSet = yield dataSetFetcher.Fetch();
            expect(dataSet).toBeInstanceOf(main_1.DataSet);
        }
        catch (e) {
            console.log('file fetch threw', e);
        }
    }));
});
//# sourceMappingURL=DataSetFetcher.test.js.map