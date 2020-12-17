/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
describe('valid instantiation', () => {
    const linearAxis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 8, 16, new main_1.LinearProgression(4));
    const fibonacciAxis = new main_1.Axis(main_1.AxisTypes.NEURONS, 10, 18, new main_1.FibonacciProgression(0));
    const exponentialAxis = new main_1.Axis(main_1.AxisTypes.LAYERS, 1, 5, new main_1.ExponentialProgression(3, 1));
    test('basic creation and readonlys', () => {
        expect(linearAxis).toBeInstanceOf(main_1.Axis);
        expect(fibonacciAxis).toBeInstanceOf(main_1.Axis);
        expect(exponentialAxis).toBeInstanceOf(main_1.Axis);
        expect(linearAxis.type).toBe(main_1.AxisTypes.BATCH_SIZE);
        expect(fibonacciAxis.type).toBe(main_1.AxisTypes.NEURONS);
        expect(exponentialAxis.type).toBe(main_1.AxisTypes.LAYERS);
        expect(linearAxis.typeName).toBe(main_1.AxisNames.BATCH_SIZE);
        expect(fibonacciAxis.typeName).toBe(main_1.AxisNames.NEURONS);
        expect(exponentialAxis.typeName).toBe(main_1.AxisNames.LAYERS);
    });
});
describe('invalid instantiation', () => {
    test('bad type enum', () => {
        // negative index
        expect(() => {
            const axis = new main_1.Axis(-1, 0, 1, new main_1.LinearProgression(1));
        }).toThrowError();
        // float index
        expect(() => {
            const axis = new main_1.Axis(0.5, 0, 1, new main_1.LinearProgression(1));
        }).toThrowError();
        // over index
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes._TOTAL, 0, 1, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('invalid bounds', () => {
        // low bound begin
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, -1, 0, new main_1.LinearProgression(1));
        }).toThrowError();
        // low bound end
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 0, -1, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    //NOTE: There is redundacy between the general bounds-checking assertions and
    //		the per-category bounds validation. Hey, better safe than sorry.
    test('bad bounds: BATCH_SIZE, begin', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 0, 1, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('bad bounds: BATCH_SIZE, end', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 1, 0, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('bad bounds: EPOCHS, begin', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.EPOCHS, 0, 1, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('bad bounds: EPOCHS, end', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.EPOCHS, 1, 0, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('bad bounds: NEURONS, begin', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.NEURONS, 0, 1, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('bad bounds: NEURONS, end', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.NEURONS, 1, 0, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('bad bounds: LAYERS, begin', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.LAYERS, -1, 0, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('bad bounds: LAYERS, end', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.LAYERS, 0, -1, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('bad bounds: LEARN_RATE, begin', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.LEARN_RATE, 0, 0.5, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('bad bounds: LEARN_RATE, end', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.LEARN_RATE, 0.5, 0, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('bad bounds: VALIDATION_SPLIT, begin', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.VALIDATION_SPLIT, 0, 0.5, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('bad bounds: VALIDATION_SPLIT, end', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.VALIDATION_SPLIT, 0.5, 0, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('bad progression: non-integer BATCH_SIZE', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 1, 2, new main_1.LinearProgression(1.5));
        }).toThrowError();
    });
    test('bad progression: non-integer EPOCHS', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.EPOCHS, 1, 2, new main_1.LinearProgression(1.5));
        }).toThrowError();
    });
    test('bad progression: non-integer NEURONS', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.NEURONS, 1, 2, new main_1.LinearProgression(1.5));
        }).toThrowError();
    });
    test('bad progression: non-integer LAYERS', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.LAYERS, 1, 2, new main_1.LinearProgression(1.5));
        }).toThrowError();
    });
    test('bad progression: integer LEARN_RATE', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.LEARN_RATE, 0.1, 0.9, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('bad progression: integer VALIDATION_SPLIT', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.VALIDATION_SPLIT, 0.1, 0.9, new main_1.LinearProgression(1));
        }).toThrowError();
    });
});
describe('methods', () => {
    const BEGIN = 5;
    const STEP = 2;
    test('iterate, confirm position, check done, reset, report', () => {
        const linearAxis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, BEGIN, 2 * BEGIN, new main_1.LinearProgression(STEP));
        expect(linearAxis.CalculatePosition()).toBe(BEGIN);
        linearAxis.Advance();
        expect(linearAxis.CalculatePosition()).toBe(BEGIN + STEP);
        expect(linearAxis.CheckComplete()).toBe(false);
        linearAxis.Advance();
        expect(linearAxis.CalculatePosition()).toBe(BEGIN + STEP + STEP);
        expect(linearAxis.CheckComplete()).toBe(false);
        linearAxis.Advance();
        expect(linearAxis.CalculatePosition()).toBe(BEGIN + STEP + STEP + STEP);
        expect(linearAxis.CheckComplete()).toBe(true);
        linearAxis.Reset();
        expect(linearAxis.CalculatePosition()).toBe(BEGIN);
        expect(linearAxis.CheckComplete()).toBe(false);
        const reportSmall = linearAxis.WriteReport(true);
        expect(typeof reportSmall).toBe('string');
        const reportLarge = linearAxis.WriteReport(false);
        expect(typeof reportLarge).toBe('string');
        // same-size reports are fine
        expect(reportLarge.length >= reportSmall.length).toBe(true);
    });
});
describe('special tests for Jest misses', () => {
    test('param validator case defaults', () => {
        const failureMessageA = new main_1.FailureMessage();
        const resultA = main_1.Axis.AttemptValidateParameter(main_1.AxisNames.LAYERS, -1, failureMessageA);
        expect(resultA).toBe(false);
        const failureMessageB = new main_1.FailureMessage();
        const resultB = main_1.Axis.AttemptValidateParameter('unknown key', 0, failureMessageB);
        expect(resultB).toBe(false);
    });
    test('progression validator case defaults', () => {
        const failureMessageA = new main_1.FailureMessage();
        const linearProgressionInt = new main_1.LinearProgression(1);
        const resultA = main_1.Axis.AttemptValidateProgression(main_1.AxisNames.LEARN_RATE, linearProgressionInt, failureMessageA);
        expect(resultA).toBe(false);
        const failureMessageB = new main_1.FailureMessage();
        const linearProgressionFloat = new main_1.LinearProgression(1.5);
        const resultB = main_1.Axis.AttemptValidateProgression(main_1.AxisNames.LEARN_RATE, linearProgressionFloat, failureMessageB);
        expect(resultB).toBe(true);
        const failureMessageC = new main_1.FailureMessage();
        const resultC = main_1.Axis.AttemptValidateProgression('unknown key', linearProgressionFloat, failureMessageC);
        expect(resultC).toBe(false);
    });
    test('name lookup switch default', () => {
        expect(() => {
            main_1.Axis.LookupTypeName(-1);
        }).toThrowError();
    });
});
//# sourceMappingURL=Axis.test.js.map