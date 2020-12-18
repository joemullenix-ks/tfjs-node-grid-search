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
exports.AxisSet = void 0;
const Utils = __importStar(require("./Utils"));
/**
 * Manages a collection of {@link Axis}.
 */
class AxisSet {
    /**
     * Creates an instance of AxisSet.
     * @param {Array<Axis>} _axes An array of {@link Axis}. Each axis must have a unique hyperparameter.
     */
    constructor(_axes) {
        // validate the incoming axes
        this._axes = _axes;
        const AXES_BY_TYPE = {};
        this._axes.forEach((axis) => {
            // no duplicates
            if (AXES_BY_TYPE[axis.type] !== undefined) {
                throw new Error('Duplicate axis found: ' + axis.typeName);
            }
            AXES_BY_TYPE[axis.type] = null;
        });
    }
    /**
     * Pass-through to advance an axis.
     * @param {number} index The axis to advance.
     */
    AdvanceAxis(index) {
        this.ValidateIndex(index);
        this._axes[index].Advance();
    }
    /**
     * Pass-through to check completion.
     * @param {number} index The axis to check.
     * @return {boolean}
     */
    CheckAxisComplete(index) {
        this.ValidateIndex(index);
        return this._axes[index].CheckComplete();
    }
    /**
     * Builds a simple map in the format "{ axis0-name: axis0-value, ... }"
     * @return {StringKeyedNumbersObject}
     */
    CreateParams() {
        const PARAMS = {};
        for (let i = 0; i < this._axes.length; ++i) {
            const AXIS = this._axes[i];
            PARAMS[AXIS.typeName] = AXIS.CalculatePosition();
        }
        return PARAMS;
    }
    /**
     * Gets the collection size.
     * @return {number}
     */
    GetTotalAxes() {
        return this._axes.length;
    }
    /**
     * Pass-through to reset an axis.
     * @param {number} index The axis to reset.
     */
    ResetAxis(index) {
        this.ValidateIndex(index);
        this._axes[index].Reset();
    }
    /**
     * Fails if an axis index is out-of-bounds.
     * @private
     * @param {number} index The axis index to validate.
     */
    ValidateIndex(index) {
        Utils.Assert(index >= 0);
        Utils.Assert(index < this._axes.length);
    }
    /**
     * Traverses the axis collection, invoking a callback for each.
     * @param {function(Axis): void} callback The function to be invoked with an instance of {@link Axis}.
     */
    Walk(callback) {
        this._axes.forEach(callback);
    }
    /**
     * Pass-through to get axis reports.
     * @param {number} index The axis to report.
     * @param {boolean} compact Whether to get a detailed report.
     * @return {string}
     */
    WriteAxisReport(index, compact) {
        this.ValidateIndex(index);
        return this._axes[index].WriteReport(compact);
    }
}
exports.AxisSet = AxisSet;
Object.freeze(AxisSet);
//# sourceMappingURL=AxisSet.js.map