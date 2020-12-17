'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
describe('instantiation and readonlys', () => {
    const linearAxis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 8, 16, new main_1.LinearProgression(4));
    const fibonacciAxis = new main_1.Axis(main_1.AxisTypes.NEURONS, 10, 18, new main_1.FibonacciProgression(0));
    const exponentialAxis = new main_1.Axis(main_1.AxisTypes.LAYERS, 1, 5, new main_1.ExponentialProgression(3, 1));
    const axes = [];
    axes.push(linearAxis);
    axes.push(fibonacciAxis);
    axes.push(exponentialAxis);
    const axisSet = new main_1.AxisSet(axes);
    const axisSetTraverser = new main_1.AxisSetTraverser(axisSet);
    test('basic creation', () => {
        expect(axisSetTraverser).toBeInstanceOf(main_1.AxisSetTraverser);
        expect(axisSetTraverser.traversed).toBe(false);
        //NOTE: This could be dynamic, but that would mean effectively rewriting the
        //		Progression class here. Nope.
        expect(axisSetTraverser.totalIterations).toBe(54);
    });
});
describe('advance until traversed', () => {
    const linearAxis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 1, 5, new main_1.LinearProgression(4));
    const axes = [];
    axes.push(linearAxis);
    const axisSet = new main_1.AxisSet(axes);
    const axisSetTraverser = new main_1.AxisSetTraverser(axisSet);
    test('continous advancement', () => {
        expect(axisSetTraverser.traversed).toBe(false);
        axisSetTraverser.Advance();
        expect(axisSetTraverser.traversed).toBe(false);
        axisSetTraverser.Advance();
        expect(axisSetTraverser.traversed).toBe(true);
        expect(() => {
            axisSetTraverser.Advance();
        }).toThrowError();
    });
});
describe('axis analyses', () => {
    const linearAxis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 1, 5, new main_1.LinearProgression(4));
    const axes = [];
    axes.push(linearAxis);
    const axisSet = new main_1.AxisSet(axes);
    const axisSetTraverser = new main_1.AxisSetTraverser(axisSet);
    test('create params', () => {
        const paramsMap = axisSetTraverser.CreateIterationParams();
        expect(typeof paramsMap).toBe('object');
        //TODO: Merge w/ AxisSet. It's (very likely) going to be refactored into this.
    });
    test('lookup axis descriptors; throw on by index', () => {
        for (let i = 0; i < axisSetTraverser.totalIterations; ++i) {
            let descriptor = '';
            expect(() => {
                descriptor = axisSetTraverser.LookupIterationDescriptor(i);
            }).not.toThrowError();
            expect(descriptor).not.toBe('');
        }
        // bad iteration index
        expect(() => {
            axisSetTraverser.LookupIterationDescriptor(axisSetTraverser.totalIterations);
        }).toThrowError();
        // really bad iteration index
        expect(() => {
            axisSetTraverser.LookupIterationDescriptor(NaN);
        }).toThrowError();
    });
    test('touch each axis', () => {
        const callbackTouch = (axisKey) => {
            expect(axisKey).toBe(main_1.AxisNames.BATCH_SIZE);
        };
        axisSetTraverser.ExamineAxisNames(callbackTouch);
    });
    test('get reports', () => {
        expect(typeof axisSetTraverser.WriteReport(true)).toBe('string');
        expect(typeof axisSetTraverser.WriteReport(false)).toBe('string');
    });
});
//# sourceMappingURL=AxisSetTraverser.test.js.map