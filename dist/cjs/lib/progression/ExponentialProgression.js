'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExponentialProgression = void 0;
const Progression_1 = require("../Progression");
const PROGRESSION_TYPENAME = 'Exponential';
class ExponentialProgression extends Progression_1.Progression {
    constructor(exponent, scale) {
        super(exponent === Math.floor(exponent) && scale === Math.floor(scale), // i.e. are these integers?
        PROGRESSION_TYPENAME);
        //NOTE: These are not constructor-privates because we need to send the constructor's args into super().
        this._exponent = 0;
        this._scale = 0;
        this._step = 0;
        // these rules prevent the progression going flat (infinite) or negative (yikes)
        //NOTE: We could support whackier curves, and will if requested. I don't anticipate that desire, but who knows.
        //		Also, the user may create a negative progression by inverting their Axis bounds, i.e. use boundBegin > boundEnd.
        console.assert(exponent > 1.0);
        console.assert(scale > 0.0);
        this._exponent = exponent;
        this._scale = scale;
        // this initializes '_step'
        this.ResetStep();
    }
    Advance() {
        this._value = this._scale * Math.pow(this._exponent, this._step);
        ++this._step;
    }
    Reset() {
        super.Reset();
        this.ResetStep();
    }
    ResetStep() {
        this._step = 0;
    }
}
exports.ExponentialProgression = ExponentialProgression;
Object.freeze(ExponentialProgression);
//# sourceMappingURL=ExponentialProgression.js.map