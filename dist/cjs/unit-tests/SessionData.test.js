/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//NOTE: TODO: Still not 100% on the folder structure. This is better.
const tngs = __importStar(require("../src/main"));
test('instantiation; callback is used; read-only are set', () => {
    const dataSetTwoZeroes = new tngs.DataSet([0, 0], [[0], [0]]);
    const standardizationCallback = jest.fn();
    const sessionData = new tngs.SessionData(0.5, dataSetTwoZeroes, false, standardizationCallback);
    expect(sessionData).toBeInstanceOf(tngs.SessionData);
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
    const dataSetTwoZeroes = new tngs.DataSet([0, 0], [[0], [0]]);
    const standardizationCallback = jest.fn();
    const sessionData = new tngs.SessionData(0.5, dataSetTwoZeroes, true, standardizationCallback);
    expect(standardizationCallback).toHaveBeenCalled();
});
test('throws on proof too low', () => {
    const dataSetTwoZeroes = new tngs.DataSet([0, 0], [[0], [0]]);
    expect(() => {
        const sessionData = new tngs.SessionData(0.01, dataSetTwoZeroes, false);
    }).toThrow();
});
test('throws on proof too high', () => {
    const dataSetTwoZeroes = new tngs.DataSet([0, 0], [[0], [0]]);
    expect(() => {
        const sessionData = new tngs.SessionData(0.99, dataSetTwoZeroes, false);
    }).toThrow();
});
//# sourceMappingURL=SessionData.test.js.map