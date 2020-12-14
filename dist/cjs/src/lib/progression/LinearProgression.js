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
exports.LinearProgression = void 0;
const Progression_1 = require("../Progression");
const Utils = __importStar(require("../Utils"));
const PROGRESSION_TYPENAME = 'Linear';
/**
 * Defines a series of steps with a fixed interval.
 * @extends Progression
 * @example
 * // linear progression in steps of 2
 * new tngs.LinearProgression(2) // 0, 2, 4, 6, 8, ...
 *
 * // linear progression in steps of 0.75
 * new tngs.LinearProgression(0.75) // 0.0, 0.75, 1.5, 2.25, 3.0, ...
*/
class LinearProgression extends Progression_1.Progression {
    /**
     * Creates an instance of LinearProgression.
     * @param {number} step The series interval.
     */
    constructor(step) {
        super(step === Math.floor(step), // i.e. is this an integer?
        PROGRESSION_TYPENAME);
        //NOTE: This is not a constructor-private because we need to send the constructor arg into super().
        this._step = 0;
        Utils.Assert(step > 0);
        this._step = step;
    }
    /**
     * Moves to the next value in the series.
     */
    Advance() {
        this._value += this._step;
    }
}
exports.LinearProgression = LinearProgression;
Object.freeze(LinearProgression);
//# sourceMappingURL=LinearProgression.js.map