/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Axis_1 = require("../src/lib/Axis");
const ModelStatics_1 = require("../src/lib/ModelStatics");
test('instantiation w empty object', () => {
    const modelStatics = new ModelStatics_1.ModelStatics({});
    expect(modelStatics).toBeInstanceOf(ModelStatics_1.ModelStatics);
});
test('instantiation w bad param key', () => {
    expect(() => {
        const modelStatics = new ModelStatics_1.ModelStatics({ unsupportedParam: 0 });
    }).toThrow();
});
test('instantiation w bad param value', () => {
    expect(() => {
        const modelStatics = new ModelStatics_1.ModelStatics({ batchSize: 0 });
    }).toThrow();
});
test('stripping param keys and cloning', () => {
    const CREATION_OBJECT = {};
    CREATION_OBJECT[Axis_1.AxisNames.BATCH_SIZE] = 1;
    const modelStatics = new ModelStatics_1.ModelStatics(CREATION_OBJECT);
    // no empty keys
    expect(() => {
        modelStatics.AttemptStripParam('');
    }).toThrow();
    modelStatics.AttemptStripParam(Axis_1.AxisNames.BATCH_SIZE);
    // unknown keys should survive silently
    expect(modelStatics.AttemptStripParam('unknownKey')).toBeUndefined();
    const CLONED_OBJECT = modelStatics.ShallowCloneParams();
    expect(typeof CLONED_OBJECT).toBe('object');
    // batch should be gone from the clone
    expect(CLONED_OBJECT).not.toHaveProperty(Axis_1.AxisNames.BATCH_SIZE);
    // the remaining axes should be present
    expect(CLONED_OBJECT).toHaveProperty(Axis_1.AxisNames.EPOCHS);
    expect(CLONED_OBJECT).toHaveProperty(Axis_1.AxisNames.LAYERS);
    expect(CLONED_OBJECT).toHaveProperty(Axis_1.AxisNames.LEARN_RATE);
    expect(CLONED_OBJECT).toHaveProperty(Axis_1.AxisNames.NEURONS);
    expect(CLONED_OBJECT).toHaveProperty(Axis_1.AxisNames.VALIDATION_SPLIT);
    //TODO: Ugly hard-coder! These are pending generators-via-callbacks-and-schedules.
    expect(CLONED_OBJECT.activationHidden).toBe('relu');
    expect(CLONED_OBJECT.activationInput).toBe('relu');
    expect(CLONED_OBJECT.activationOutput).toBe('softmax');
});
test('generators produce valid objects', () => {
    const modelStatics = new ModelStatics_1.ModelStatics({});
    //NOTE: This isn't good enough.
    //TODO: Revisit these once we fully integrate w/ the TensorFlow types.
    expect(modelStatics.GenerateInitializerBias()).toBeDefined();
    expect(modelStatics.GenerateInitializerKernel()).toBeDefined();
    expect(modelStatics.GenerateLossFunction()).toBe('categoricalCrossentropy');
    expect(modelStatics.GenerateOptimizer(0.5)).toBeDefined();
    // the optimizer takes an input
    expect(() => {
        modelStatics.GenerateOptimizer(0);
    }).toThrow();
    expect(() => {
        modelStatics.GenerateOptimizer(1);
    }).toThrow();
});
//# sourceMappingURL=ModelStatics.test.js.map