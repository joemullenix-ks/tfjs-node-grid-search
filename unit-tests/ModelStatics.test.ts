/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';


import { StringKeyedNumbersObject } from '../src/main';


import { Axis, AxisDefaults, AxisNames, AxisTypes } from '../src/lib/Axis';
import { ModelStatics } from '../src/lib/ModelStatics';


test('instantiation w empty object', () => {
	const modelStatics = new ModelStatics({});

	expect(modelStatics).toBeInstanceOf(ModelStatics);
});

test('instantiation w bad param key', () => {
	expect(() => {
		const modelStatics = new ModelStatics({unsupportedParam: 0});
	}).toThrow();
});

test('instantiation w bad param value', () => {
	expect(() => {
		const modelStatics = new ModelStatics({batchSize: 0});
	}).toThrow();
});

test('stripping param keys and cloning', () => {
	const CREATION_OBJECT:StringKeyedNumbersObject = {};

	CREATION_OBJECT[AxisNames.BATCH_SIZE] = 1;

	const modelStatics = new ModelStatics(CREATION_OBJECT);

	// no empty keys
	expect(() => {
		modelStatics.AttemptStripParam('');
	}).toThrow();

	modelStatics.AttemptStripParam(AxisNames.BATCH_SIZE);

	// unknown keys should survive silently
	expect(modelStatics.AttemptStripParam('unknownKey')).toBeUndefined();

	const CLONED_OBJECT = modelStatics.ShallowCloneParams();

	expect(typeof CLONED_OBJECT).toBe('object');

	// batch should be gone from the clone
	expect(CLONED_OBJECT).not.toHaveProperty(AxisNames.BATCH_SIZE);

	// the remaining axes should be present
	expect(CLONED_OBJECT).toHaveProperty(AxisNames.EPOCHS);
	expect(CLONED_OBJECT).toHaveProperty(AxisNames.LAYERS);
	expect(CLONED_OBJECT).toHaveProperty(AxisNames.LEARN_RATE);
	expect(CLONED_OBJECT).toHaveProperty(AxisNames.NEURONS);
	expect(CLONED_OBJECT).toHaveProperty(AxisNames.VALIDATION_SPLIT);

//TODO: Ugly hard-coder! These are pending generators-via-callbacks-and-schedules.
	expect(CLONED_OBJECT.activationHidden).toBe('relu');
	expect(CLONED_OBJECT.activationInput).toBe('relu');
	expect(CLONED_OBJECT.activationOutput).toBe('softmax');
});

test('generators produce valid objects', () => {
	const modelStatics = new ModelStatics({});

//NOTE: This isn't good enough.
//TODO: Revisit these once we fully integrate w/ the TensorFlow types.

	expect(modelStatics.GenerateInitializerBias()).toBeDefined();
	expect(modelStatics.GenerateInitializerKernel()).toBeDefined();
	expect(modelStatics.GenerateLossFunction()).toBe('categoricalCrossentropy')
	expect(modelStatics.GenerateOptimizer(0.5)).toBeDefined();

	// the optimizer takes an input
	expect(() => {
		modelStatics.GenerateOptimizer(0);
	}).toThrow();

	expect(() => {
		modelStatics.GenerateOptimizer(1);
	}).toThrow();
});
