'use strict';


export type NumberKeyedStringsObject    = { [key: number]: string; };
export type StringKeyedNullsObject      = { [key: string]: null; };
export type StringKeyedNumbersObject    = { [key: string]: number; };
export type StringKeyedSimpleObject     = { [key: string]: string | number | boolean; };
export type StringKeyedStringsObject    = { [key: string]: string; };


//TODO: I am not at all satisfied with this array typing, specifically the
//      "Array<unknown>" cop-out. TypeScript is perfectly happy with the 'array
//      stack' union, but ESLint is not. I tried a few templated, generic and/or
//      recursive approaches, with varying degrees of success, but nothing clean
//      enough.
//
//		The next approach will use TF's built-in types (e.g. TensorLike).
//      See: ModelStatics.ts

//NOTE: TensorFlow's Tensor classes go up to six, thus these defines. If you
//      need seven, by all means extend.
export type ArrayOrder1 = Array<number>;
export type ArrayOrder2 = Array<Array<number>>;
export type ArrayOrder3 = Array<Array<Array<number>>>;
export type ArrayOrder4 = Array<Array<Array<Array<number>>>>;
export type ArrayOrder5 = Array<Array<Array<Array<Array<number>>>>>;
export type ArrayOrder6 = Array<Array<Array<Array<Array<Array<number>>>>>>;

export type TFArrayStack = ArrayOrder1 | ArrayOrder2 | ArrayOrder3 | ArrayOrder4 | ArrayOrder5 | ArrayOrder6;

export type TFCase = ArrayOrder1 | ArrayOrder2 | ArrayOrder3 | ArrayOrder4 | ArrayOrder5;

export type TFNestedArray = Array<unknown>;
