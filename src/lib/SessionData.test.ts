'use strict';


// import { DataSet } from './DataSet';
// import * as TENSOR_FLOW from '@tensorflow/tfjs-node';
// import { ArrayOrder2, TFArrayStack, TFNestedArray } from './types';
// import { DataSet } from './DataSet';
// import * as SessionData from './SessionData';

//TODO: NEXT: Lifting the tests up a folder, to avoid this backward visibility
import * as tngs from '../main';

/*
test('average of [0, 7] is 3.5', () => {
  expect(SessionData.ArrayCalculateAverage([0, 7])).toBe(3.5);
});
*/
/*
  const dataSetFetcher = new tngs.DataSetFetcher(process.argv);

  const dataSet = await dataSetFetcher.Fetch();

  // set aside 10% of these cases for post-training generalization tests
  const TEST_DATA_FRACTION = 0.1;

  const sessionData = new tngs.SessionData(
    TEST_DATA_FRACTION,
    dataSet,
    true
  );
*/

test('class instantiates', () => {
  const dataSet = new tngs.DataSet([0, 0], [[0], [0]]);

  const sessionData = new tngs.SessionData(
    0.5,
    dataSet,
    true
  );

  expect(sessionData).toBeInstanceOf(tngs.SessionData);
});

test('ctor throws on mismatched data', () => {
  expect(() => {
	const dataSet = new tngs.DataSet([0, 0, 0], [[0], [0]]);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const sessionData = new tngs.SessionData(
		0.5,
		dataSet,
		true
	);
  }).toThrow();
});
