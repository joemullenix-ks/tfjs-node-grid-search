'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxisSetTraverser = void 0;
class AxisSetTraverser {
    constructor(_axisSet) {
        this._axisSet = _axisSet;
        this._totalAxes = 0;
        this._traversed = false;
        this._iterationDescriptorsByIndex = {};
        this._totalIterations = 0;
        this._totalAxes = this._axisSet.GetTotalAxes(); // cache this; it doesn't change
        this._traversed = false;
        //NOTE: This function is buried in the c'tor because it actually runs the traversal (advances the axes).
        //		It cleans up after itself, resetting to a pristine state on the way out.
        this._iterationDescriptorsByIndex = {};
        this._totalIterations = 0;
        const BUILD_SCHEDULE = () => {
            let reportText = '';
            for (let i = 0; !this._traversed; ++i) {
                ++this._totalIterations;
                const DESCRIPTOR = this.WriteReport(true); // compact report
                this._iterationDescriptorsByIndex[i] = DESCRIPTOR;
                //TODO: (maybe) add a "x3" suffix to this printout; needs 'repetitions' from the owner.
                //		...could make more sense to factor this out of the constructor. The protection of the 'running' state seems misplaced.
                reportText += DESCRIPTOR + '\n';
                this.Advance();
            }
            console.log('Iteration schedule:' + '\n' + reportText);
            // reset for traversals managed by the owner
            this._traversed = false;
        };
        BUILD_SCHEDULE();
    }
    get totalIterations() { return this._totalIterations; }
    get traversed() { return this._traversed; }
    Advance() {
        console.assert(!this._traversed);
        let resetCounter = 0;
        for (let i = 0; i < this._totalAxes; ++i) {
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
    }
    CreateIterationParams() {
        return this._axisSet.CreateParams();
    }
    ExamineAxisNames(callback) {
        this._axisSet.Walk((axis) => {
            callback(axis.typeName);
        });
    }
    LookupIterationDescriptor(index) {
        if (this._iterationDescriptorsByIndex[index] === undefined) {
            throw new Error('Attempted to lookup descriptor for unknown iteration: ' + index);
        }
        return this._iterationDescriptorsByIndex[index];
    }
    WriteReport(compact) {
        let reportText = '';
        for (let i = 0; i < this._totalAxes; ++i) {
            reportText += (compact ? '' : '• ')
                + this._axisSet.WriteAxisReport(i, compact)
                + (compact ? ', ' : '\n');
        }
        // remove the trailing newline or comma-and-space
        reportText = reportText.slice(0, (compact ? -2 : -1));
        return reportText;
    }
}
exports.AxisSetTraverser = AxisSetTraverser;
Object.freeze(AxisSetTraverser);
//# sourceMappingURL=AxisSetTraverser.js.map