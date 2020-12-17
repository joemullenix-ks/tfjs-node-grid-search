'use strict';


import { FileIOResult } from '../src/main';


test('instantiation', () => {
  const fileIOResult = new FileIOResult();

  expect(fileIOResult).toBeInstanceOf(FileIOResult);

  const TEXT_FULL = 'something';

  fileIOResult.data = TEXT_FULL;

  expect(fileIOResult.data).toBe(TEXT_FULL);

  // empty string is fatal
  expect(() => {
    fileIOResult.data = '';
  }).toThrowError();
});
