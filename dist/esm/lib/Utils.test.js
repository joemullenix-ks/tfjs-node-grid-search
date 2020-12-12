/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
'use strict';
import * as Utils from './Utils';
/*NOTE: Consider wrapping test sections like this:
            describe('QueueRotate tests', () => {
              test('low count throws', () => {
                expect(() => {
                  Utils.QueueRotate([], 0, 1);
                }).toThrow();
              });
            });

        It produces a prefix in the event the test fails; very lovely.

TODO:   I'm not sold on duplicating the symbols at this level ... yet. Well see
        once one of the bigger manager classes is testified.
*/
test('average of [0, 7] is 3.5', () => {
    expect(Utils.ArrayCalculateAverage([0, 7])).toBe(3.5);
});
test('empty array throws', () => {
    expect(() => {
        Utils.ArrayCalculateAverage([]);
    }).toThrow();
});
test('high index of [0, 7] is 1', () => {
    expect(Utils.ArrayFindIndexOfHighestValue([0, 7])).toBe(1);
});
test('empty array throws', () => {
    expect(() => {
        Utils.ArrayFindIndexOfHighestValue([]);
    }).toThrow();
});
test('0 is false', () => {
    expect(Utils.CheckFloat0to1Exclusive(0)).toBe(false);
});
test('1 is false', () => {
    expect(Utils.CheckFloat0to1Exclusive(1)).toBe(false);
});
test('0.5 is true', () => {
    expect(Utils.CheckFloat0to1Exclusive(0.5)).toBe(true);
});
test('-1 is false', () => {
    expect(Utils.CheckNonNegativeInteger(-1)).toBe(false);
});
test('0 is true', () => {
    expect(Utils.CheckNonNegativeInteger(0)).toBe(true);
});
test('1.5 is false', () => {
    expect(Utils.CheckNonNegativeInteger(1.5)).toBe(false);
});
test('0 is false', () => {
    expect(Utils.CheckPositiveInteger(0)).toBe(false);
});
test('1 is true', () => {
    expect(Utils.CheckPositiveInteger(1)).toBe(true);
});
test('1.5 is false', () => {
    expect(Utils.CheckPositiveInteger(1.5)).toBe(false);
});
test('low count throws', () => {
    expect(() => {
        Utils.QueueRotate([], 0, 0);
    }).toThrow();
});
test('queue grows by one when below count', () => {
    const values = [0];
    Utils.QueueRotate(values, 0, 3);
    expect(values.length).toBe(2);
});
test('queue does not outgrow count', () => {
    const COUNT = 1;
    const values = new Array(COUNT);
    values.fill(0);
    Utils.QueueRotate(values, 0, COUNT);
    expect(values.length).toBe(COUNT);
});
test('rethrows an error', () => {
    expect(() => {
        Utils.ThrowCaughtUnknown('pre', new Error('err'));
    }).toThrow();
});
test('rethrows a string', () => {
    expect(() => {
        Utils.ThrowCaughtUnknown('pre', 'err');
    }).toThrow();
});
test('rethrows an unknown', () => {
    expect(() => {
        Utils.ThrowCaughtUnknown('pre', undefined);
    }).toThrow();
});
test('does not throw on boolean', () => {
    expect(() => {
        Utils.ValidateTextForCSV(true);
    }).not.toThrow();
});
test('does not throw on number', () => {
    expect(() => {
        Utils.ValidateTextForCSV(1.0);
    }).not.toThrow();
});
test('does not throw on valid string', () => {
    expect(() => {
        Utils.ValidateTextForCSV('valid');
    }).not.toThrow();
});
test('throws on string w/ commma', () => {
    expect(() => {
        Utils.ValidateTextForCSV('invalid,');
    }).toThrow();
});
test('throws on string w/ newline', () => {
    expect(() => {
        Utils.ValidateTextForCSV('invalid\n');
    }).toThrow();
});
test('throws if duration is negative', () => {
    expect(() => {
        Utils.WriteDurationReport(-1);
    }).toThrow();
});
test('returns string with "ms"', () => {
    expect(Utils.WriteDurationReport(0)).toMatch(/ms/);
});
//# sourceMappingURL=Utils.test.js.map