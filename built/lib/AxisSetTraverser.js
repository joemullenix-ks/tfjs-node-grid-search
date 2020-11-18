'use strict';
var AxisSet = require('./AxisSet').AxisSet;
var AxisSetTraverser = /** @class */ (function () {
    function AxisSetTraverser(axisSet) {
        var _this = this;
        console.assert(axisSet instanceof AxisSet);
        this._axisSet = axisSet;
        this._totalAxes = this._axisSet.GetTotalAxes(); // cache this; it doesn't change
        this._traversed = false;
        //NOTE: This function is buried in the c'tor because it actually runs the traversal (advances the axes).
        //		It cleans up after itself, resetting to a pristine state on the way out.
        this._iterationDescriptorsByIndex = {};
        this._totalIterations = 0;
        var BUILD_SCHEDULE = function () {
            var reportText = '';
            for (var i = 0; !_this._traversed; ++i) {
                ++_this._totalIterations;
                var DESCRIPTOR = _this.WriteReport(true); // compact report
                _this._iterationDescriptorsByIndex[i] = DESCRIPTOR;
                //TODO: (maybe) add a "x3" suffix to this printout; needs 'repetitions' from the owner.
                //		...could make more sense to factor this out of the constructor. The protection of the 'running' state seems misplaced.
                reportText += DESCRIPTOR + '\n';
                _this.Advance();
            }
            console.log('Iteration schedule:' + '\n' + reportText);
            // reset for traversals managed by the owner
            _this._traversed = false;
        };
        BUILD_SCHEDULE();
    }
    Object.defineProperty(AxisSetTraverser.prototype, "totalIterations", {
        get: function () { return this._totalIterations; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisSetTraverser.prototype, "traversed", {
        get: function () { return this._traversed; },
        enumerable: false,
        configurable: true
    });
    AxisSetTraverser.prototype.Advance = function () {
        console.assert(!this._traversed);
        var resetCounter = 0;
        for (var i = 0; i < this._totalAxes; ++i) {
            this._axisSet.AdvanceAxis(i);
            if (this._axisSet.CheckAxisComplete(i)) {
                this._axisSet.ResetAxis(i);
                //KEEP: This is useful, but currently too spammy (without digging out the axis name, it's also too vague).
                //		There's a decent chance this comes back after the first round of user feedback.
                //				console.log('Axis ' + i + ' reset');
                ++resetCounter;
                continue;
            }
            return;
        }
        console.assert(resetCounter === this._totalAxes);
        // this advance completed the traversal; reset
        this._traversed = true;
    };
    AxisSetTraverser.prototype.CreateIterationParams = function () {
        return this._axisSet.CreateParams();
    };
    AxisSetTraverser.prototype.ExamineAxisNames = function (callback) {
        this._axisSet.Walk(function (axis) {
            callback(axis.typeName);
        });
    };
    AxisSetTraverser.prototype.LookupIterationDescriptor = function (i) {
        console.assert(typeof i === 'number');
        if (this._iterationDescriptorsByIndex[i] === undefined) {
            throw new Error('Attempted to lookup descriptor for unknown iteration: ' + i);
        }
        return this._iterationDescriptorsByIndex[i];
    };
    AxisSetTraverser.prototype.WriteReport = function (compact) {
        var reportText = '';
        for (var i = 0; i < this._totalAxes; ++i) {
            reportText += (compact ? '' : '• ')
                + this._axisSet.WriteAxisReport(i, compact)
                + (compact ? ', ' : '\n');
        }
        // remove the trailing newline or comma-and-space
        reportText = reportText.slice(0, (compact ? -2 : -1));
        return reportText;
    };
    return AxisSetTraverser;
}());
Object.freeze(AxisSetTraverser);
exports.AxisSetTraverser = AxisSetTraverser;
