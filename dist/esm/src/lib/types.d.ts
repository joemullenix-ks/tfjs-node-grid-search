export declare type NumberKeyedStringsObject = {
    [key: number]: string;
};
export declare type StringKeyedNullsObject = {
    [key: string]: null;
};
export declare type StringKeyedNumbersObject = {
    [key: string]: number;
};
export declare type StringKeyedSimpleObject = {
    [key: string]: string | number | boolean;
};
export declare type StringKeyedStringsObject = {
    [key: string]: string;
};
export declare type ArrayOrder1 = Array<number>;
export declare type ArrayOrder2 = Array<Array<number>>;
export declare type ArrayOrder3 = Array<Array<Array<number>>>;
export declare type ArrayOrder4 = Array<Array<Array<Array<number>>>>;
export declare type ArrayOrder5 = Array<Array<Array<Array<Array<number>>>>>;
export declare type ArrayOrder6 = Array<Array<Array<Array<Array<Array<number>>>>>>;
export declare type TFArrayStack = ArrayOrder1 | ArrayOrder2 | ArrayOrder3 | ArrayOrder4 | ArrayOrder5 | ArrayOrder6;
export declare type TFCase = ArrayOrder1 | ArrayOrder2 | ArrayOrder3 | ArrayOrder4 | ArrayOrder5;
export declare type TFNestedArray = Array<unknown>;
