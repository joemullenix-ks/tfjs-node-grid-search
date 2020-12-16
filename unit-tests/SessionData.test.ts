/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';


import { DataSet, SessionData } from '../src/main';


test('instantiation; callback is used; read-only are set', () => {
  const dataSetTwoZeroes = new DataSet([0, 0], [[0], [0]]);

  const standardizationCallback = jest.fn();

  const sessionData = new SessionData(
    0.5,
    dataSetTwoZeroes,
    false,
    standardizationCallback
  );

  expect(sessionData).toBeInstanceOf(SessionData);
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
  const dataSetTwoZeroes = new DataSet([0, 0], [[0], [0]]);

  const standardizationCallback = jest.fn();

  const sessionData = new SessionData(
    0.5,
    dataSetTwoZeroes,
    true,
    standardizationCallback
  );

  expect(standardizationCallback).toHaveBeenCalled();
});

test('throws on proof too low', () => {
  const dataSetTwoZeroes = new DataSet([0, 0], [[0], [0]]);

  expect(() => {
    const sessionData = new SessionData(
      0.01,
      dataSetTwoZeroes,
      false
    );
  }).toThrow();
});

test('throws on proof too high', () => {
  const dataSetTwoZeroes = new DataSet([0, 0], [[0], [0]]);

  expect(() => {
    const sessionData = new SessionData(
      0.99,
      dataSetTwoZeroes,
      false
    );
  }).toThrow();
});
