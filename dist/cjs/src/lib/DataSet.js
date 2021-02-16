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
exports.DataSet = void 0;
const Utils = __importStar(require("./Utils"));
/**
 * The inputs and targets that will be used to train and test network models.
 */
class DataSet {
    /**
     * Creates an instance of DataSet.
     * @param {TFNestedArray} _inputs The cases that will be sent to TF's model
     *                                fit(). The values must be nested arrays,
     *                                because they will become TF tensors. See
     *                                {@link https://js.tensorflow.org/api/latest/#tensor}
     *                                for details. Note that the flat-array
     *                                option is not yet supported.
     * @param {ArrayOrder2} _targets The output values associated with the
     *                               input data. Must be a two-dimensional
     *                               nested array. Note: Proper format
     *                               flexibility is coming soon!
     * @example
     * // create a data set with inputs and targets for three cases
     * new tngs.DataSet([[ 0, 2, 0, 4 ], [ 9, 2, 9, 6 ], [ 3, 5, 7, 1 ]],
     *                  [[ 1, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, 1 ]]);
     *
     * // In this data, there are four inputs for each case. The targets are
     * // one-hot classification probabilities, labeled "even", "mixed" and
     * // "odd".
     */
    constructor(_inputs, _targets) {
        this._inputs = _inputs;
        this._targets = _targets;
        Utils.Assert(this._inputs.length > 0);
        if (this._inputs.length !== this._targets.length) {
            throw new Error('Data invalid. The number of inputs ('
                + this._inputs.length + ') does not match the '
                + 'number of targets (' + this._targets.length
                + ') .');
        }
    }
    get inputs() { return this._inputs; }
    get targets() { return this._targets; }
}
exports.DataSet = DataSet;
Object.freeze(DataSet);
//# sourceMappingURL=DataSet.js.map