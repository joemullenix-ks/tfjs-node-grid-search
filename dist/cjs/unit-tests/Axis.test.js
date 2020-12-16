/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
describe('valid instantiation and readonlys', () => {
    const linearAxis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 8, 16, new main_1.LinearProgression(4));
    const fibonacciAxis = new main_1.Axis(main_1.AxisTypes.NEURONS, 10, 18, new main_1.FibonacciProgression(0));
    const exponentialAxis = new main_1.Axis(main_1.AxisTypes.LAYERS, 1, 5, new main_1.ExponentialProgression(3, 1));
    test('basic creation', () => {
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
    test('bad bounds', () => {
        // low bound begin
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, -1, 0, new main_1.LinearProgression(1));
        }).toThrowError();
        // low bound end
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 0, -1, new main_1.LinearProgression(1));
        }).toThrowError();
    });
    test('bad bounds: BATCH_SIZE', () => {
        expect(() => {
            const axis = new main_1.Axis(main_1.AxisTypes.BATCH_SIZE, 0, 0, new main_1.LinearProgression(1));
        }).toThrowError();
    });
});
//# sourceMappingURL=Axis.test.js.map