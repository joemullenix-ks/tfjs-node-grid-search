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