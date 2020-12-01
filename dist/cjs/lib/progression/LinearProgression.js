'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearProgression = void 0;
const Progression_1 = require("../Progression");
const PROGRESSION_TYPENAME = 'Linear';
class LinearProgression extends Progression_1.Progression {
    constructor(step) {
        super(step === Math.floor(step), // i.e. is this an integer?
        PROGRESSION_TYPENAME);
        //NOTE: This is not a constructor-private because we need to send the constructor arg into super().
        this._step = 0;
        this._step = step;
    }
    Advance() {
        this._value += this._step;
    }
}
exports.LinearProgression = LinearProgression;
Object.freeze(LinearProgression);
//# sourceMappingURL=LinearProgression.js.map