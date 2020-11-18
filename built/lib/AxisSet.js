'use strict';
var Axis = require('./Axis').Axis;
var AxisSet = /** @class */ (function () {
    function AxisSet(axes) {
        console.assert(Array.isArray(axes));
        // validate the incoming axes
        var AXES_BY_TYPE = {};
        axes.forEach(function (axis) {
            console.assert(axis instanceof Axis);
            // no duplicates
            if (AXES_BY_TYPE[axis.type] !== undefined) {
                throw new Error('Duplicate axis found: ' + axis.typeName);
            }
            AXES_BY_TYPE[axis.type] = 0;
        });
        this._axes = axes;
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
            //TODO: Should we do these by index or key?? This isn't particularly perf-intensive, so keys will be much friendlier to write
            //		and debug.
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
        return this._axes[index].Reset();
    };
    AxisSet.prototype.ValidateIndex = function (index) {
        console.assert(typeof index === 'number');
        console.assert(index >= 0);
        console.assert(index < this._axes.length);
    };
    AxisSet.prototype.Walk = function (callback) {
        console.assert(typeof callback === 'function');
        this._axes.forEach(callback);
    };
    AxisSet.prototype.WriteAxisReport = function (index, compact) {
        this.ValidateIndex(index);
        return this._axes[index].WriteReport(compact);
    };
    return AxisSet;
}());
Object.freeze(AxisSet);
exports.AxisSet = AxisSet;
