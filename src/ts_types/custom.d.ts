
//NOTE: TensorFlow's Tensor classes go up to six, thus these defines. If you need seven, by all means extend.
type ArrayOrder1 = Array<number>;
type ArrayOrder2 = Array<Array<number>>;
type ArrayOrder3 = Array<Array<Array<number>>>;
type ArrayOrder4 = Array<Array<Array<Array<number>>>>;
type ArrayOrder5 = Array<Array<Array<Array<Array<number>>>>>;
type ArrayOrder6 = Array<Array<Array<Array<Array<Array<number>>>>>>;

export type TFInputsArray = ArrayOrder2 | ArrayOrder3 | ArrayOrder4 | ArrayOrder5 | ArrayOrder6;
