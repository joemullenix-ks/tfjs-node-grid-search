'use strict';
import { Axis, AxisSet, AxisSetTraverser, AxisTypes, ExponentialProgression, FibonacciProgression, LinearProgression } from '../src/main';
describe('instantiation and readonlys', () => {
    const linearAxis = new Axis(AxisTypes.BATCH_SIZE, 8, 16, new LinearProgression(4));
    const fibonacciAxis = new Axis(AxisTypes.NEURONS, 10, 18, new FibonacciProgression(0));
    const exponentialAxis = new Axis(AxisTypes.LAYERS, 1, 5, new ExponentialProgression(3, 1));
    const axes = [];
    axes.push(linearAxis);
    axes.push(fibonacciAxis);
    axes.push(exponentialAxis);
    const axisSet = new AxisSet(axes);
    const axisSetTraverser = new AxisSetTraverser(axisSet);
    test('basic creation', () => {
        expect(axisSetTraverser).toBeInstanceOf(AxisSetTraverser);
        expect(axisSetTraverser.traversed).toBe(false);
        //NOTE: This could be dynamic, but that would mean effectively rewriting the
        //		Progression class here. Nope.
        expect(axisSetTraverser.totalIterations).toBe(54);
    });
    /*
        test('creation w/ random strings', () => {
            expect(new AxisSetTraverser(['0', '1', '2', '3'])).toBeInstanceOf(AxisSetTraverser);
        });
    
        test('creation w/ extra strings (supported)', () => {
            expect(new AxisSetTraverser(['0', '1', '2', '3', '4'])).toBeInstanceOf(AxisSetTraverser);
        });
    
        test('under-count throws', () => {
            expect(() => {
                new AxisSetTraverser(['0', '1', '2']);
            }).toThrow();
        });
    
        test('duplicate paths throw', () => {
            expect(() => {
                new AxisSetTraverser(['0', '1', '2', '2']);
            }).toThrow();
        });
    */
});
//# sourceMappingURL=AxisSetTraverser.test.js.map