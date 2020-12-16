'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
describe('instantiation', () => {
    const INPUTS_ONE = [0];
    const INPUTS_TWO = [0, 0];
    const TARGETS = [[0]];
    test('creation', () => {
        expect(new main_1.DataSet(INPUTS_ONE, TARGETS)).toBeInstanceOf(main_1.DataSet);
    });
    test('mismatch throws', () => {
        expect(() => {
            new main_1.DataSet(INPUTS_TWO, TARGETS);
        }).toThrow();
    });
});
describe('readonlys', () => {
    const INPUTS_ONE = [0];
    const TARGETS = [[0]];
    const dataSet = new main_1.DataSet(INPUTS_ONE, TARGETS);
    expect(dataSet.inputs.length).toBe(1);
    expect(dataSet.targets.length).toBe(1);
});
//# sourceMappingURL=DataSet.test.js.map