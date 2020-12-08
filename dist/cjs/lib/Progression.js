'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progression = void 0;
/*KEEP: TO BE MOVED INTO DOCUMENTATION

EXAMPLE PROGRESSION VALUES

[LINEAR]		// value = base + {0, 1 * step, 2 * step, ...}
Axis
boundBegin	= 0
boundEnd	= 3
step		= 1
Progression	= 0, 1, 2, 3
Values		= 0, 1, 2, 3, [4]

Axis
boundBegin	= 6
boundEnd	= 4
step		= 1
Progression	= 0, 1, 2
Values		= 6, 5, 4, [3]

Axis
boundBegin	= 0.5
boundEnd	= 2.0
step		= 0.5
Progression	= 0.0, 0.5, 1.0, 1.5
Values		= 0.5, 1.0, 1.5, 2.0, [2.5]

[EXPONENTIAL]	// value = base + {0, scale * base ^ 0, scale * base ^ 1, scale * base ^ 2, ...}
Axis
boundBegin	= 0
boundEnd	= 10
base		= 2
scale		= 1
Progression	= 0, 1, 2, 4, 8
Values		= 0, 1, 2, 4, 8, [16]

Axis
boundBegin	= 600
boundEnd	= 300
base		= 3
scale		= 2
Progression	= 0, 2, 6, 18, 54, 162
Values		= 600, 598, 594, 582, 546, 438, [114]

Axis
boundBegin	= 1000
boundEnd	= 85000
base		= 4
scale		= 10
Progression	= 0, 10, 40, 160, 640, 2560, 10240, 40960
Values		= 1000, 1010, 1040, 1160, 1640, 3560, 41960, [164840]

Axis
boundBegin	= 5.0
boundEnd	= 20.0
base		= 1.5
scale		= 0.5
Progression	= 0.0, 0.5, 0.75, 1.125, 1.6875
Values		= 5.0, 6.0, 7.5, 11.25, [20.625]

[FIBONACCI-ish] // value = base + {special cases 0 and 1, then chooses the nearest Fibonacci number}
Axis
boundBegin	= 0
boundEnd	= 5
initiator	= 0
Progression	= 0, 1, 2, 3, 5
Values		= 0, 1, 2, 3, 5, [8]

Axis
boundBegin	= 7
boundEnd	= 60
initiator	= 3
Progression	= 0, 3, 5, 8, 13, 21, 34
Values		= 7, 10, 12, 15, 20, 28, 41, [62]

Axis
boundBegin	= 100
boundEnd	= 70
initiator	= 10
Progression	= 0, 8, 13, 21 // we round down to 8 as nearest-Fibonacci value {8 <= 10 <= 13}
Values		= 100, 92, 87, 79, [66]
*/
/**
 * Abstract base of the Progression classes.
 * @abstract
 */
class Progression {
    /**
     * Creates an instance of Progression.
     * @param {boolean} _integerBased Send 'true' if this progression uses
     *								  integer steps exclusively (as opposed to
     *								  floating-point).
     * @param {string} _typeName A simple label for logging.
     */
    constructor(_integerBased, // "integerBased" as opposed to floating point
    _typeName) {
        this._integerBased = _integerBased;
        this._typeName = _typeName;
        console.assert(this._typeName !== '');
        //NOTE: All progressions begin at zero, because the bounds of the range we traverse are inclusive.
        this._value = 0;
    }
    get integerBased() { return this._integerBased; }
    get typeName() { return this._typeName; }
    get value() { return this._value; }
    /**
     * Puts the progression in its initial state (_value = 0).
     * @memberof Progression
     */
    Reset() {
        this._value = 0;
    }
}
exports.Progression = Progression;
Object.freeze(Progression);
//# sourceMappingURL=Progression.js.map