'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxisSet = void 0;
class AxisSet {
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
    AdvanceAxis(index) {
        this.ValidateIndex(index);
        this._axes[index].Advance();
    }
    CheckAxisComplete(index) {
        this.ValidateIndex(index);
        return this._axes[index].CheckComplete();
    }
    CreateParams() {
        const PARAMS = {};
        for (let i = 0; i < this._axes.length; ++i) {
            const AXIS = this._axes[i];
            //TODO: Should we do these by index or key?? This isn't particularly perf-intensive, and keys are much friendlier
            //		to write and debug.
            //		This will be revisited when I implement minification.
            PARAMS[AXIS.typeName] = AXIS.CalculatePosition();
        }
        return PARAMS;
    }
    GetTotalAxes() {
        return this._axes.length;
    }
    ResetAxis(index) {
        this.ValidateIndex(index);
        this._axes[index].Reset();
    }
    ValidateIndex(index) {
        console.assert(index >= 0);
        console.assert(index < this._axes.length);
    }
    Walk(callback) {
        this._axes.forEach(callback);
    }
    WriteAxisReport(index, compact) {
        this.ValidateIndex(index);
        return this._axes[index].WriteReport(compact);
    }
}
exports.AxisSet = AxisSet;
Object.freeze(AxisSet);
//# sourceMappingURL=AxisSet.js.map