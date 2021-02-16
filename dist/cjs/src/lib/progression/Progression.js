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
exports.Progression = void 0;
const Utils = __importStar(require("../Utils"));
/**
 * Abstract base of the Progression classes.
 * @abstract
 */
class Progression {
    /**
     * Creates an instance of Progression.
     * @param {boolean} _integerBased Send 'true' if this progression uses
     *                                integer steps exclusively (as opposed to
     *                                floating-point).
     * @param {string} _typeName A simple label for logging.
     */
    constructor(_integerBased, // "integerBased" as opposed to floating point
    _typeName) {
        this._integerBased = _integerBased;
        this._typeName = _typeName;
        Utils.Assert(this._typeName !== '');
        //NOTE: All progressions begin at zero, because the bounds of the range we traverse are inclusive.
        this._value = 0;
    }
    get integerBased() { return this._integerBased; }
    get typeName() { return this._typeName; }
    get value() { return this._value; }
    /**
     * Puts the progression in its initial state (_value = 0).
     */
    Reset() {
        this._value = 0;
    }
}
exports.Progression = Progression;
Object.freeze(Progression);
//# sourceMappingURL=Progression.js.map