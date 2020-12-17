'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
describe('valid instantiation', () => {
    const linearAxis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 8, 16, new main_1.LinearProgression(4));
    const fibonacciAxis = new main_1.Axis(main_1.AxisTypes.NEURONS, 10, 18, new main_1.FibonacciProgression(0));
    const exponentialAxis = new main_1.Axis(main_1.AxisTypes.LAYERS, 1, 5, new main_1.ExponentialProgression(3, 1));
    const axes = [];
    axes.push(linearAxis);
    axes.push(fibonacciAxis);
    axes.push(exponentialAxis);
    const axisSet = new main_1.AxisSet(axes);
    test('basic creation', () => {
        expect(axisSet).toBeInstanceOf(main_1.AxisSet);
    });
});
describe('invalid instantiation', () => {
    const batchAxisA = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 8, 16, new main_1.LinearProgression(4));
    const batchAxisB = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 8, 16, new main_1.LinearProgression(4));
    const axes = [];
    axes.push(batchAxisA);
    axes.push(batchAxisB);
    test('duplicate axes throw', () => {
        expect(() => {
            new main_1.AxisSet(axes);
        }).toThrow();
    });
});
describe('non-walk methods', () => {
    const linearAxis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 1, 3, new main_1.LinearProgression(2));
    const axes = [];
    axes.push(linearAxis);
    const axisSet = new main_1.AxisSet(axes);
    test('get length', () => {
        expect(axisSet.GetTotalAxes()).toBe(1);
    });
    test('advance, check complete, reset, report', () => {
        const AXIS_INDEX = 0;
        expect(axisSet.CheckAxisComplete(AXIS_INDEX)).toBe(false);
        axisSet.AdvanceAxis(AXIS_INDEX);
        expect(axisSet.CheckAxisComplete(AXIS_INDEX)).toBe(false);
        axisSet.AdvanceAxis(AXIS_INDEX);
        expect(axisSet.CheckAxisComplete(AXIS_INDEX)).toBe(true);
        axisSet.ResetAxis(AXIS_INDEX);
        expect(axisSet.CheckAxisComplete(AXIS_INDEX)).toBe(false);
        const reportCompact = axisSet.WriteAxisReport(AXIS_INDEX, false);
        expect(typeof reportCompact).toBe('string');
        expect(reportCompact).not.toBe('');
        const reportNormal = axisSet.WriteAxisReport(AXIS_INDEX, false);
        expect(typeof reportNormal).toBe('string');
        expect(reportNormal).not.toBe('');
        expect(reportCompact.length <= reportNormal.length).toBe(true);
    });
    test('create params', () => {
        const paramsMap = axisSet.CreateParams();
        expect(typeof paramsMap).toBe('object');
        expect(paramsMap[main_1.AxisNames.BATCH_SIZE]).toBe(1);
    });
});
describe('walk axes', () => {
    const axis1 = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 1, 3, new main_1.LinearProgression(2));
    const axis2 = new main_1.Axis(main_1.AxisTypes.EPOCHS, 1, 3, new main_1.LinearProgression(2));
    const axes = [];
    axes.push(axis1);
    axes.push(axis2);
    const axisSet = new main_1.AxisSet(axes);
    test('touch each axis', () => {
        const callbackTouch = (axis) => {
            expect(axis).toBeDefined();
        };
        axisSet.Walk(callbackTouch);
    });
});
//# sourceMappingURL=AxisSet.test.js.map