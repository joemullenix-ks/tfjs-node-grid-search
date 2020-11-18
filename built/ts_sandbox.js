'use strict';
//DOOM: ENTIRE FILE IS DEV ONLY AND TEMPORARY
/*
import { FileReadResult } from './lib/FileReadResult';


const { Utils } = require('./lib/Utils');
*/
function CheckInteger(x) {
    // if (typeof x !== 'number') {
    // 	return false;
    // }
    if (x !== Math.floor(x)) {
        return false;
    }
    return true;
}
var USER_OBJECT = {
    arbitraryField: 5
};
var RESULT_USER_OBJ = CheckInteger(USER_OBJECT.arbitraryField);
console.log('RESULT_USER_OBJ', RESULT_USER_OBJ);
