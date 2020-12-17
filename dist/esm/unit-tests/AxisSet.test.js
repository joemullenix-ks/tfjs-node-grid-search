'use strict';
import { Axis, AxisNames, AxisSet, AxisTypes, ExponentialProgression, FibonacciProgression, LinearProgression } from '../src/main';
describe('valid instantiation', () => {
    const linearAxis = new Axis(AxisTypes.BATCH_SIZE, 8, 16, new LinearProgression(4));
    const fibonacciAxis = new Axis(AxisTypes.NEURONS, 10, 18, new FibonacciProgression(0));
    const exponentialAxis = new Axis(AxisTypes.LAYERS, 1, 5, new ExponentialProgression(3, 1));
    const axes = [];
    axes.push(linearAxis);
    axes.push(fibonacciAxis);
    axes.push(exponentialAxis);
    const axisSet = new AxisSet(axes);
    test('basic creation', () => {
        expect(axisSet).toBeInstanceOf(AxisSet);
    });
});
describe('invalid instantiation', () => {
    const batchAxisA = new Axis(AxisTypes.BATCH_SIZE, 8, 16, new LinearProgression(4));
    const batchAxisB = new Axis(AxisTypes.BATCH_SIZE, 8, 16, new LinearProgression(4));
    const axes = [];
    axes.push(batchAxisA);
    axes.push(batchAxisB);
    test('duplicate axes throw', () => {
        expect(() => {
            new AxisSet(axes);
        }).toThrow();
    });
});
describe('non-walk methods', () => {
    const linearAxis = new Axis(AxisTypes.BATCH_SIZE, 1, 3, new LinearProgression(2));
    const axes = [];
    axes.push(linearAxis);
    const axisSet = new AxisSet(axes);
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
        expect(paramsMap[AxisNames.BATCH_SIZE]).toBe(1);
    });
});
describe('walk axes', () => {
    const axis1 = new Axis(AxisTypes.BATCH_SIZE, 1, 3, new LinearProgression(2));
    const axis2 = new Axis(AxisTypes.EPOCHS, 1, 3, new LinearProgression(2));
    const axes = [];
    axes.push(axis1);
    axes.push(axis2);
    const axisSet = new AxisSet(axes);
    test('touch each axis', () => {
        const callbackTouch = (axis) => {
            expect(axis).toBeDefined();
        };
        axisSet.Walk(callbackTouch);
    });
});
//# sourceMappingURL=AxisSet.test.js.map