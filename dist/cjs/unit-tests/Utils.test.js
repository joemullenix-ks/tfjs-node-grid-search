'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
test('average of [0, 7] is 3.5', () => {
    expect(main_1.Utils.ArrayCalculateAverage([0, 7])).toBe(3.5);
});
test('empty array throws', () => {
    expect(() => {
        main_1.Utils.ArrayCalculateAverage([]);
    }).toThrow();
});
test('high index of [0, 7] is 1', () => {
    expect(main_1.Utils.ArrayFindIndexOfHighestValue([0, 7])).toBe(1);
});
test('empty array throws', () => {
    expect(() => {
        main_1.Utils.ArrayFindIndexOfHighestValue([]);
    }).toThrow();
});
test('0 is false', () => {
    expect(main_1.Utils.CheckFloat0to1Exclusive(0)).toBe(false);
});
test('1 is false', () => {
    expect(main_1.Utils.CheckFloat0to1Exclusive(1)).toBe(false);
});
test('0.5 is true', () => {
    expect(main_1.Utils.CheckFloat0to1Exclusive(0.5)).toBe(true);
});
test('-1 is false', () => {
    expect(main_1.Utils.CheckNonNegativeInteger(-1)).toBe(false);
});
test('0 is true', () => {
    expect(main_1.Utils.CheckNonNegativeInteger(0)).toBe(true);
});
test('1.5 is false', () => {
    expect(main_1.Utils.CheckNonNegativeInteger(1.5)).toBe(false);
});
test('0 is false', () => {
    expect(main_1.Utils.CheckPositiveInteger(0)).toBe(false);
});
test('1 is true', () => {
    expect(main_1.Utils.CheckPositiveInteger(1)).toBe(true);
});
test('1.5 is false', () => {
    expect(main_1.Utils.CheckPositiveInteger(1.5)).toBe(false);
});
test('low count throws', () => {
    expect(() => {
        main_1.Utils.QueueRotate([], 0, 0);
    }).toThrow();
});
test('queue grows by one when below count', () => {
    const values = [0];
    main_1.Utils.QueueRotate(values, 0, 3);
    expect(values.length).toBe(2);
});
test('queue does not outgrow count', () => {
    const COUNT = 1;
    const values = new Array(COUNT);
    values.fill(0);
    main_1.Utils.QueueRotate(values, 0, COUNT);
    expect(values.length).toBe(COUNT);
});
test('rethrows an error', () => {
    expect(() => {
        main_1.Utils.ThrowCaughtUnknown('pre', new Error('err'));
    }).toThrow();
});
test('rethrows a string', () => {
    expect(() => {
        main_1.Utils.ThrowCaughtUnknown('pre', 'err');
    }).toThrow();
});
test('rethrows an unknown', () => {
    expect(() => {
        main_1.Utils.ThrowCaughtUnknown('pre', undefined);
    }).toThrow();
});
test('does not throw on boolean', () => {
    expect(() => {
        main_1.Utils.ValidateTextForCSV(true);
    }).not.toThrow();
});
test('does not throw on number', () => {
    expect(() => {
        main_1.Utils.ValidateTextForCSV(1.0);
    }).not.toThrow();
});
test('does not throw on valid string', () => {
    expect(() => {
        main_1.Utils.ValidateTextForCSV('valid');
    }).not.toThrow();
});
test('throws on string w/ commma', () => {
    expect(() => {
        main_1.Utils.ValidateTextForCSV('invalid,');
    }).toThrow();
});
test('throws on string w/ newline', () => {
    expect(() => {
        main_1.Utils.ValidateTextForCSV('invalid\n');
    }).toThrow();
});
test('throws if duration is negative', () => {
    expect(() => {
        main_1.Utils.WriteDurationReport(-1);
    }).toThrow();
});
test('returns string with "ms"', () => {
    expect(main_1.Utils.WriteDurationReport(0)).toMatch(/ms/);
});
//# sourceMappingURL=Utils.test.js.map