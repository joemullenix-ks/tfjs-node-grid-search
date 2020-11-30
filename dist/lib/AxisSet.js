'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxisSet = void 0;
var AxisSet = /** @class */ (function () {
    function AxisSet(_axes) {
        // validate the incoming axes
        this._axes = _axes;
        var AXES_BY_TYPE = {};
        this._axes.forEach(function (axis) {
            // no duplicates
            if (AXES_BY_TYPE[axis.type] !== undefined) {
                throw new Error('Duplicate axis found: ' + axis.typeName);
            }
            AXES_BY_TYPE[axis.type] = null;
        });
    }
    AxisSet.prototype.AdvanceAxis = function (index) {
        this.ValidateIndex(index);
        this._axes[index].Advance();
    };
    AxisSet.prototype.CheckAxisComplete = function (index) {
        this.ValidateIndex(index);
        return this._axes[index].CheckComplete();
    };
    AxisSet.prototype.CreateParams = function () {
        var PARAMS = {};
        for (var i = 0; i < this._axes.length; ++i) {
            var AXIS = this._axes[i];
            //TODO: Should we do these by index or key?? This isn't particularly perf-intensive, and keys are much friendlier
            //		to write and debug.
            //		This will be revisited when I implement minification.
            PARAMS[AXIS.typeName] = AXIS.CalculatePosition();
        }
        return PARAMS;
    };
    AxisSet.prototype.GetTotalAxes = function () {
        return this._axes.length;
    };
    AxisSet.prototype.ResetAxis = function (index) {
        this.ValidateIndex(index);
        this._axes[index].Reset();
    };
    AxisSet.prototype.ValidateIndex = function (index) {
        console.assert(index >= 0);
        console.assert(index < this._axes.length);
    };
    AxisSet.prototype.Walk = function (callback) {
        this._axes.forEach(callback);
    };
    AxisSet.prototype.WriteAxisReport = function (index, compact) {
        this.ValidateIndex(index);
        return this._axes[index].WriteReport(compact);
    };
    return AxisSet;
}());
exports.AxisSet = AxisSet;
Object.freeze(AxisSet);
//# sourceMappingURL=AxisSet.js.map