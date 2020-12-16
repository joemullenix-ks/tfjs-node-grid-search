'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
test('instantiation', () => {
    const fileIOResult = new main_1.FileIOResult();
    expect(fileIOResult).toBeInstanceOf(main_1.FileIOResult);
    const TEXT_FULL = 'something';
    fileIOResult.data = TEXT_FULL;
    expect(fileIOResult.data).toBe(TEXT_FULL);
    // empty string is fatal
    expect(() => {
        fileIOResult.data = '';
    }).toThrowError();
});
//# sourceMappingURL=FileIOResult.test.js.map