'use strict';
var GET_THOSE_BEANS = function (flavor) {
    console.log('got those ' + flavor + ' beans!');
};
var Taco = /** @class */ (function () {
    function Taco(total, callbackGetBeans) {
        console.log('init ' + total + ' tacos, eh');
        this._callbackGetBeans = callbackGetBeans;
        if (this._callbackGetBeans !== undefined) {
            this._callbackGetBeans('pork');
            return;
        }
        console.log('WHAT! (no beans)');
    }
    return Taco;
}());
var TACO_A = new Taco(15, GET_THOSE_BEANS);
var TACO_B = new Taco(2);
//# sourceMappingURL=ts_sandbox.js.map