'use strict';


//DOOM: ENTIRE FILE IS DEV ONLY AND TEMPORARY


/*
import { FileReadResult } from './lib/FileReadResult';


const { Utils } = require('./lib/Utils');
*/


function CheckInteger(x: number): boolean {
	// if (typeof x !== 'number') {
	// 	return false;
	// }

	if (x !== Math.floor(x)) {
		return false;
	}

	return true;
}

const USER_OBJECT =	{
						arbitraryField: 5
					};

const RESULT_USER_OBJ = CheckInteger(USER_OBJECT.arbitraryField);

console.log('RESULT_USER_OBJ', RESULT_USER_OBJ);

/*
class TestClass {
	_x: number;

	constructor(x: number) {
		this._x = x;
	}
}


const RESULT_CLASS = CheckInteger((new TestClass('7'))._x);

console.log('RESULT_CLASS', RESULT_CLASS);

const RESULT_STRING = CheckInteger('not a number');
const RESULT_BOOLEAN = CheckInteger(true);
const RESULT_NUMBER = CheckInteger(9.99);

console.log('RESULT_STRING', RESULT_STRING);
console.log('RESULT_BOOLEAN', RESULT_BOOLEAN);
console.log('RESULT_NUMBER', RESULT_NUMBER);

let pauserA = 1;


const RESULT_U_STRING = Utils.CheckNonNegativeInteger('not a number');
const RESULT_U_BOOLEAN = Utils.CheckNonNegativeInteger(true);
const RESULT_U_NUMBER = Utils.CheckNonNegativeInteger(9.99);

console.log('RESULT_U_STRING', RESULT_U_STRING);
console.log('RESULT_U_BOOLEAN', RESULT_U_BOOLEAN);
console.log('RESULT_U_NUMBER', RESULT_U_NUMBER);

let pauserB = 1;
*/