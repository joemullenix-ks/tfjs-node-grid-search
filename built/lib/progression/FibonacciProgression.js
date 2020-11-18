'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Progression = require('../Progression').Progression;
var PROGRESSION_TYPENAME = 'Fibonacci';
var FibonacciProgression = /** @class */ (function (_super) {
    __extends(FibonacciProgression, _super);
    //NOTE: It might seem useful to offer two arbitrary params, e.g. (1.5, 4), and let the user define their own
    //		Fibonacci-ish sequence. I actually tried that, and lo and behold, it basically finds it's way back
    //		to the actual Fibonaccis. It doesn't merged, exactly, but it produces the same curve, just slightly
    //		offset.
    //		Makes sense in retrospect. The algorithm only cares about two inputs on the first step. After that,
    //		it exclusively uses one (the sum).
    //		Nature FTW.
    function FibonacciProgression(initiator) {
        var _this = _super.call(this, true, // always integer based (no need to overcomplicate)
        PROGRESSION_TYPENAME) || this;
        console.assert(typeof initiator === 'number');
        console.assert(initiator >= 0);
        console.assert(initiator === Math.floor(initiator));
        _this._initiator = initiator;
        // we special case the first few values, to avoid grid iterations that don't differ, e.g. 0, 1, 1, 2, ...
        if (initiator <= 1) {
            _this._initFiboA = 0;
            _this._initFiboB = 1;
        }
        else {
            var FIRST_PICK = FIND_NEAREST_FIBONACCI_NUMBER(initiator);
            // choose the two inputs that generate the Fibonacci number nearest the initiator
            _this._initFiboA = FIND_NEAREST_FIBONACCI_NUMBER(FIRST_PICK * APPROXIMATE_FIBONACCI_RATIO * APPROXIMATE_FIBONACCI_RATIO);
            _this._initFiboB = FIND_NEAREST_FIBONACCI_NUMBER(FIRST_PICK * APPROXIMATE_FIBONACCI_RATIO);
        }
        if (_this._initFiboB < _this._initFiboA
            || (_this._initFiboA === _this._initFiboB && _this._initFiboA !== 1)) {
            throw new Error('invalid Fibonacci sequence initiator (' + initiator + '). Please choose another value.');
        }
        // this initializes '_fiboA' and '_fiboB'
        _this.ResetFibonacciInputs();
        return _this;
    }
    FibonacciProgression.prototype.Advance = function () {
        this._value = this._fiboA + this._fiboB;
        this._fiboA = this._fiboB;
        this._fiboB = this._value;
    };
    FibonacciProgression.prototype.Reset = function () {
        _super.prototype.Reset.call(this);
        this.ResetFibonacciInputs();
    };
    FibonacciProgression.prototype.ResetFibonacciInputs = function () {
        this._fiboA = this._initFiboA;
        this._fiboB = this._initFiboB;
    };
    return FibonacciProgression;
}(Progression));
//NOTE: Hilarious: https://codegolf.stackexchange.com/questions/133365/find-the-closest-fibonacci-number
//
//		f=(n,x=0,y=1)=>y<n?f(n,y,x+y):y-n>n-x?x:y
//
//		answered Jul 19 '17 at 16:27 by Neil
var FIND_NEAREST_FIBONACCI_NUMBER = function (n, x, y) {
    //PERF: This is not fast! Any high-frequency usage should instead use a cache.
    if (x === void 0) { x = 0; }
    if (y === void 0) { y = 1; }
    //NOTE: Though this looks dangerously unbounded, I've tested it up to max-integers, and it only goes ~80 calls deep.
    //		The limits in browsers are all 20k plus, and VSCode 64k; not in the realm of reasonable worry.
    //		...just ensure non-negative!
    console.assert(n >= 0);
    return y < n
        ? FIND_NEAREST_FIBONACCI_NUMBER(n, y, x + y)
        : y - n > n - x
            ? x
            : y;
};
var APPROXIMATE_FIBONACCI_RATIO = 0.6180339850;
Object.freeze(FibonacciProgression);
exports.FibonacciProgression = FibonacciProgression;
