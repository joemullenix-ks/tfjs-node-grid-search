'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSet = void 0;
class DataSet {
    constructor(_inputs, _targets) {
        this._inputs = _inputs;
        this._targets = _targets;
        console.assert(this._inputs.length > 0);
        console.assert(this._inputs.length === this._targets.length);
    }
    get inputs() { return this._inputs; }
    get targets() { return this._targets; }
}
exports.DataSet = DataSet;
Object.freeze(DataSet);
//# sourceMappingURL=DataSet.js.map