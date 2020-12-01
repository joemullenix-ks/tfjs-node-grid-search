'use strict';
import { Progression } from '../Progression';
const PROGRESSION_TYPENAME = 'Linear';
class LinearProgression extends Progression {
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
Object.freeze(LinearProgression);
export { LinearProgression };
//# sourceMappingURL=LinearProgression.js.map