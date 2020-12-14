'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FibonacciProgression = void 0;
const Progression_1 = require("./Progression");
const Utils = __importStar(require("../Utils"));
const PROGRESSION_TYPENAME = 'Fibonacci';
/**
 * Defines a series of steps starting from an arbitrary point in the Fibonacci
 * sequence.
 * @extends Progression
 * @example
 * // Fibonacci progression starting at 0*
 * new tngs.FibonacciProgression(0) // 0, 1, 2, 3, 5, ...
 *
 * // Fibonacci progression starting at 5
 * new tngs.FibonacciProgression(5) // 5, 8, 13, 21, 34, ...
 *
 * // *To prevent repeating models, the beginning of the Fibonacci sequence is tweaked.
 */
class FibonacciProgression extends Progression_1.Progression {
    /**
    * Creates an instance of FibonacciProgression.
    * @param {number} _initiator The starting point in the Fibonacci sequence.
    */
    constructor(_initiator) {
        //NOTE: It might seem useful to offer two arbitrary params, e.g. (1.5, 4), and let the user define their own
        //		Fibonacci-ish sequence. I actually tried that, and lo and behold, it basically finds its way back
        //		to the actual Fibonaccis. It doesn't merge, exactly, but it produces the same curve, just slightly
        //		offset.
        //		Makes sense in retrospect. The algorithm only cares about two inputs on the first step. After that,
        //		it exclusively uses one (the sum).
        //		Nature FTW.
        super(true, // always integer based (no need to overcomplicate)
        PROGRESSION_TYPENAME);
        this._initiator = _initiator;
        this._fiboA = 0;
        this._fiboB = 0;
        this._initFiboA = 0;
        this._initFiboB = 0;
        Utils.Assert(this._initiator >= 0);
        if (this._initiator !== Math.floor(this._initiator)) {
            this._initiator = Math.round(this._initiator);
            console.warn('Fibonacci initiator cast to integer: ' + this._initiator);
        }
        // we special case the first few values, to avoid grid iterations that don't differ, e.g. 0, 1, 1, 2, ...
        if (this._initiator <= 1) {
            this._initFiboA = 0;
            this._initFiboB = 1;
        }
        else {
            const FIRST_PICK = FIND_NEAREST_FIBONACCI_NUMBER(this._initiator);
            // choose the two inputs that generate the Fibonacci number nearest the initiator
            this._initFiboA = FIND_NEAREST_FIBONACCI_NUMBER(FIRST_PICK * APPROXIMATE_FIBONACCI_RATIO * APPROXIMATE_FIBONACCI_RATIO);
            this._initFiboB = FIND_NEAREST_FIBONACCI_NUMBER(FIRST_PICK * APPROXIMATE_FIBONACCI_RATIO);
        }
        if (this._initFiboB < this._initFiboA
            || (this._initFiboA === this._initFiboB && this._initFiboA !== 1)) {
            throw new Error('invalid Fibonacci sequence initiator (' + this._initiator + '). Please choose another value.');
        }
        // this initializes '_fiboA' and '_fiboB'
        this.ResetFibonacciInputs();
    }
    /**
     * Moves to the next value in the series.
     */
    Advance() {
        this._value = this._fiboA + this._fiboB;
        this._fiboA = this._fiboB;
        this._fiboB = this._value;
    }
    Reset() {
        super.Reset();
        this.ResetFibonacciInputs();
    }
    ResetFibonacciInputs() {
        this._fiboA = this._initFiboA;
        this._fiboB = this._initFiboB;
    }
}
exports.FibonacciProgression = FibonacciProgression;
//NOTE: Hilarious: https://codegolf.stackexchange.com/questions/133365/find-the-closest-fibonacci-number
//
//		f=(n,x=0,y=1)=>y<n?f(n,y,x+y):y-n>n-x?x:y
//
//		answered Jul 19 '17 at 16:27 by Neil
const FIND_NEAREST_FIBONACCI_NUMBER = (n, x = 0, y = 1) => {
    //PERF: This is not fast! Any high-frequency usage should instead use a cache.
    //NOTE: Although this looks dangerously unbounded, I've tested it up to max-integers, and it only goes ~80 calls deep.
    //		The limits in browsers are all 20k plus, and VSCode 64k; not in the realm of reasonable worry.
    //		...just ensure non-negative!
    console.assert(n >= 0);
    return y < n
        ? FIND_NEAREST_FIBONACCI_NUMBER(n, y, x + y)
        : y - n > n - x
            ? x
            : y;
};
const APPROXIMATE_FIBONACCI_RATIO = 0.6180339850;
Object.freeze(FibonacciProgression);
//# sourceMappingURL=FibonacciProgression.js.map