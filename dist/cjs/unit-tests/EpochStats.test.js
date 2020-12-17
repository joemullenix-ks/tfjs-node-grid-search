/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
describe('instantiation', () => {
    test('conjure the proper object', () => {
        expect(new main_1.EpochStats(1)).toBeInstanceOf(main_1.EpochStats);
    });
    test('low trailDepth throws', () => {
        expect(() => {
            const epochStats = new main_1.EpochStats(0);
        }).toThrow();
    });
    test('float trailDepth throws', () => {
        expect(() => {
            const epochStats = new main_1.EpochStats(1.5);
        }).toThrow();
    });
});
describe('update call with bad inputs', () => {
    const epochStats = new main_1.EpochStats(2);
    test('low epoch throws', () => {
        expect(() => {
            epochStats.Update(-1, { logsKey: 0 });
        }).toThrow();
    });
    test('float epoch throws', () => {
        expect(() => {
            epochStats.Update(0.5, { logsKey: 0 });
        }).toThrow();
    });
});
describe('update call produces accurate stats', () => {
    const epochStats = new main_1.EpochStats(2);
    const ACC_0 = 0.2;
    const LOSS_0 = 0.8;
    const VAL_ACC_0 = 0.4;
    const VAL_LOSS_0 = 0.6;
    const ACC_1 = 1;
    const LOSS_1 = 0;
    const VAL_ACC_1 = 0.5;
    const VAL_LOSS_1 = 0.5;
    //NOTE: These objects mock the TF "Logs" type, which has no constructor.
    const MOCK_LOGS_0 = {
        acc: ACC_0,
        loss: LOSS_0,
        val_acc: VAL_ACC_0,
        val_loss: VAL_LOSS_0
    };
    const MOCK_LOGS_1 = {
        acc: ACC_1,
        loss: LOSS_1,
        val_acc: VAL_ACC_1,
        val_loss: VAL_LOSS_1
    };
    test('low epoch', () => {
        let updateCount = 0;
        epochStats.Update(updateCount, MOCK_LOGS_0);
        ++updateCount;
        expect(epochStats.averageAccuracy).toBe(ACC_0);
        expect(epochStats.averageLoss).toBe(LOSS_0);
        expect(epochStats.averageValidationAccuracy).toBe(VAL_ACC_0);
        expect(epochStats.averageValidationLoss).toBe(VAL_LOSS_0);
        epochStats.Update(updateCount, MOCK_LOGS_1);
        ++updateCount;
        expect(epochStats.averageAccuracy).toBe((ACC_0 + ACC_1) / updateCount);
        expect(epochStats.averageLoss).toBe((LOSS_0 + LOSS_1) / updateCount);
        expect(epochStats.averageValidationAccuracy).toBe((VAL_ACC_0 + VAL_ACC_1) / updateCount);
        expect(epochStats.averageValidationLoss).toBe((VAL_LOSS_0 + VAL_LOSS_1) / updateCount);
        //NOTE: TODO: Do these dynamically, when you have the gusto to dig into it.
        //			  Currently locked into test-pass mode, not line math mode.
        //  { m: 0.8, b: 0.19999999999999996 }
        expect(epochStats.lineAccuracy.m).toBe(0.8);
        expect(epochStats.lineAccuracy.b).toBe(0.19999999999999996);
        //  { m: -0.8, b: 0.8 }
        expect(epochStats.lineLoss.m).toBe(-0.8);
        expect(epochStats.lineLoss.b).toBe(0.8);
        //  { m: 0.09999999999999998, b: 0.4 }
        expect(epochStats.lineValidationAccuracy.m).toBe(0.09999999999999998);
        expect(epochStats.lineValidationAccuracy.b).toBe(0.4);
        //  { m: -0.10000000000000009, b: 0.6000000000000001 }
        expect(epochStats.lineValidationLoss.m).toBe(-0.10000000000000009);
        expect(epochStats.lineValidationLoss.b).toBe(0.6000000000000001);
    });
});
test('report helpers write strings', () => {
    const epochStats = new main_1.EpochStats(1);
    expect(typeof epochStats.WriteReport()).toBe('string');
    expect(typeof main_1.EpochStats.WriteReportHeader()).toBe('string');
});
//# sourceMappingURL=EpochStats.test.js.map