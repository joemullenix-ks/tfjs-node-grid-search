'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
test('instantiation', () => {
    const emptyModelParams = new main_1.ModelParams({}, {});
    expect(emptyModelParams).toBeInstanceOf(main_1.ModelParams);
    const leftModelParams = new main_1.ModelParams({ testKeyL: 0 }, {});
    expect(leftModelParams).toBeInstanceOf(main_1.ModelParams);
    const rightModelParams = new main_1.ModelParams({}, { testKeyR: 0 });
    expect(rightModelParams).toBeInstanceOf(main_1.ModelParams);
});
test('instantiation throws on collision', () => {
    expect(() => {
        const modelParams = new main_1.ModelParams({ testKey: 0 }, { testKey: 0 });
        expect(modelParams).toBeInstanceOf(main_1.ModelParams);
    }).toThrow();
});
test('pulls boolean params; throws on invalid', () => {
    const KEY_BOOLEAN_FALSE = 'boolFalse';
    const KEY_BOOLEAN_TRUE = 'boolTrue';
    const KEY_BOOLEAN_INVALID_NUMBER = 'boolInvalidNumber';
    const KEY_BOOLEAN_INVALID_STRING = 'boolInvalidString';
    const OBJECT_LEFT = {};
    const OBJECT_RIGHT = {};
    OBJECT_LEFT[KEY_BOOLEAN_FALSE] = false;
    OBJECT_LEFT[KEY_BOOLEAN_INVALID_NUMBER] = 0;
    OBJECT_RIGHT[KEY_BOOLEAN_TRUE] = true;
    OBJECT_RIGHT[KEY_BOOLEAN_INVALID_STRING] = '';
    const modelParams = new main_1.ModelParams(OBJECT_LEFT, OBJECT_RIGHT);
    expect(modelParams.GetBooleanParam(KEY_BOOLEAN_FALSE)).toBe(false);
    expect(modelParams.GetBooleanParam(KEY_BOOLEAN_TRUE)).toBe(true);
    expect(() => {
        modelParams.GetBooleanParam(KEY_BOOLEAN_INVALID_NUMBER);
    }).toThrow();
    expect(() => {
        modelParams.GetBooleanParam(KEY_BOOLEAN_INVALID_STRING);
    }).toThrow();
});
test('pulls numeric params; throws on invalid', () => {
    const KEY_NUMERIC_LEFT = 'numericZero';
    const KEY_NUMERIC_RIGHT = 'numericNegative0point5';
    const KEY_NUMERIC_INVALID_BOOLEAN = 'numericInvalidBoolean';
    const KEY_NUMERIC_INVALID_STRING = 'numericInvalidString';
    const OBJECT_LEFT = {};
    const OBJECT_RIGHT = {};
    OBJECT_LEFT[KEY_NUMERIC_LEFT] = 0;
    OBJECT_LEFT[KEY_NUMERIC_INVALID_BOOLEAN] = false;
    OBJECT_RIGHT[KEY_NUMERIC_RIGHT] = -0.5;
    OBJECT_RIGHT[KEY_NUMERIC_INVALID_STRING] = '';
    const modelParams = new main_1.ModelParams(OBJECT_LEFT, OBJECT_RIGHT);
    expect(modelParams.GetNumericParam(KEY_NUMERIC_LEFT)).toBe(0);
    expect(modelParams.GetNumericParam(KEY_NUMERIC_RIGHT)).toBe(-0.5);
    expect(() => {
        modelParams.GetNumericParam(KEY_NUMERIC_INVALID_BOOLEAN);
    }).toThrow();
    expect(() => {
        modelParams.GetNumericParam(KEY_NUMERIC_INVALID_STRING);
    }).toThrow();
});
test('pulls text params; throws on invalid and unknown', () => {
    const KEY_TEXT_LEFT = 'textEmpty';
    const KEY_TEXT_RIGHT = 'textPotatoesWithNewline';
    const KEY_TEXT_INVALID_BOOLEAN = 'textInvalidBoolean';
    const KEY_TEXT_INVALID_NUMBER = 'textInvalidNumber';
    const OBJECT_LEFT = {};
    const OBJECT_RIGHT = {};
    OBJECT_LEFT[KEY_TEXT_LEFT] = '';
    OBJECT_LEFT[KEY_TEXT_INVALID_BOOLEAN] = false;
    OBJECT_RIGHT[KEY_TEXT_RIGHT] = 'Potatoes\n';
    OBJECT_RIGHT[KEY_TEXT_INVALID_NUMBER] = 0;
    const modelParams = new main_1.ModelParams(OBJECT_LEFT, OBJECT_RIGHT);
    expect(modelParams.GetTextParam(KEY_TEXT_LEFT)).toBe('');
    expect(modelParams.GetTextParam(KEY_TEXT_RIGHT)).toBe('Potatoes\n');
    expect(() => {
        modelParams.GetTextParam(KEY_TEXT_INVALID_BOOLEAN);
    }).toThrow();
    expect(() => {
        modelParams.GetTextParam(KEY_TEXT_INVALID_NUMBER);
    }).toThrow();
    expect(() => {
        modelParams.GetTextParam('neverAdded');
    }).toThrow();
});
//# sourceMappingURL=ModelParams.test.js.map