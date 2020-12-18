/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
test('instantiation; callback is used; read-only are set', () => {
    const dataSetTwoZeroes = new main_1.DataSet([0, 0], [[0], [0]]);
    const standardizationCallback = jest.fn();
    const sessionData = new main_1.SessionData(0.5, dataSetTwoZeroes, false, standardizationCallback);
    expect(sessionData).toBeInstanceOf(main_1.SessionData);
    expect(standardizationCallback).toHaveBeenCalled();
    expect(sessionData.proofInputsTensor).toBeDefined();
    expect(sessionData.proofTargets).toEqual(expect.any(Array));
    expect(sessionData.rawInputsProof).toEqual(expect.any(Array));
    expect(sessionData.totalInputNeurons).toBeGreaterThan(0);
    expect(sessionData.totalOutputNeurons).toBeGreaterThan(0);
    expect(sessionData.totalTrainingCases).toBeGreaterThan(0);
    expect(sessionData.trainingInputsTensor).toBeDefined();
    expect(sessionData.trainingTargetsTensor).toBeDefined();
});
test('treats callback as override', () => {
    const dataSetTwoZeroes = new main_1.DataSet([0, 0], [[0], [0]]);
    const standardizationCallback = jest.fn();
    const sessionData = new main_1.SessionData(0.5, dataSetTwoZeroes, true, standardizationCallback);
    expect(standardizationCallback).toHaveBeenCalled();
});
test('uses normal standardization w/o callback', () => {
    const dataSetTwoZeroes = new main_1.DataSet([0, 0], [[0], [0]]);
    expect(() => {
        const sessionData = new main_1.SessionData(0.5, dataSetTwoZeroes, true);
    }).not.toThrowError();
});
test('deeper tensors do not throw', () => {
    const dataSetTwoZeroes = new main_1.DataSet([[1, 2], [3, 4]], [[0], [1]]);
    expect(() => {
        const sessionData = new main_1.SessionData(0.5, dataSetTwoZeroes, true);
    }).not.toThrowError();
});
test('throws on invalid dataset A', () => {
    const dataSetInvalid = new main_1.DataSet([[], [[1, 2], [3, 4], [5, '6']], [[1, 2], [3, 4], [5, false]]], [[0], [0], [0]]);
    expect(() => {
        const sessionData = new main_1.SessionData(0.5, dataSetInvalid, true);
    }).toThrowError();
});
test('throws on invalid dataset B', () => {
    const dataSetInvalid = new main_1.DataSet([[0, 0], [[1, 2], [3, 4], [5, '6']], [[1, 2], [3, 4], [5, false]]], [[0], [0], [0]]);
    expect(() => {
        const sessionData = new main_1.SessionData(0.5, dataSetInvalid, true);
    }).toThrowError();
});
test('throws on invalid dataset C', () => {
    const dataSetInvalid = new main_1.DataSet([[['1', 2]], [[3, 4]], [[5, 6]]], [[0], [0], [0]]);
    expect(() => {
        const sessionData = new main_1.SessionData(0.5, dataSetInvalid, true);
    }).toThrowError();
});
test('throws on proof too low', () => {
    const dataSetTwoZeroes = new main_1.DataSet([0, 0], [[0], [0]]);
    expect(() => {
        const sessionData = new main_1.SessionData(0.01, dataSetTwoZeroes, false);
    }).toThrow();
});
test('throws on proof too high', () => {
    const dataSetTwoZeroes = new main_1.DataSet([0, 0], [[0], [0]]);
    expect(() => {
        const sessionData = new main_1.SessionData(0.99, dataSetTwoZeroes, false);
    }).toThrow();
});
//# sourceMappingURL=SessionData.test.js.map