/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
'use strict';


import * as Utils from './Utils';


test('average of [0, 7] is 3.5', () => {
  expect(Utils.ArrayCalculateAverage([0, 7])).toBe(3.5);
});

test('empty array throws', () => {
  expect(() => {
    Utils.ArrayCalculateAverage([]);
  }).toThrow();
});