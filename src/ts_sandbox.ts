'use strict';


//DOOM: ENTIRE FILE IS DEV ONLY AND TEMPORARY



type FlavorCallback = (flavor: string) => void;


const GET_THOSE_BEANS: FlavorCallback = (flavor) => {
	console.log('got those ' + flavor + ' beans!');
}


class Taco {
	_callbackGetBeans?: FlavorCallback;

	constructor(total: number, callbackGetBeans?: FlavorCallback) {
		console.log('init ' + total + ' tacos, eh');

		this._callbackGetBeans = callbackGetBeans;

		if (this._callbackGetBeans !== undefined) {
			this._callbackGetBeans('pork');
			return;
		}

		console.log('WHAT! (no beans)');
	}
}


const TACO_A = new Taco(15, GET_THOSE_BEANS);

const TACO_B = new Taco(2);


/*
const GET_THOSE_BEANS = (flavor: string): void => {
	console.log('got those ' + flavor + ' beans!');
}


class Taco {
	_callbackGetBeans?: (flavor: string) => void;

	constructor(total: number, callbackGetBeans?: (flavor: string) => void) {
		console.log('init ' + total + ' tacos, eh');

		this._callbackGetBeans = callbackGetBeans;

		if (this._callbackGetBeans !== undefined) {
			this._callbackGetBeans('pork');
			return;
		}

		console.log('WHAT! (no beans)');
	}
}


const TACO_A = new Taco(15, GET_THOSE_BEANS);

const TACO_B = new Taco(2);
*/