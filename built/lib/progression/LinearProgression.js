'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearProgression = void 0;
var Progression_1 = require("../Progression");
var PROGRESSION_TYPENAME = 'Linear';
var LinearProgression = /** @class */ (function (_super) {
    __extends(LinearProgression, _super);
    function LinearProgression(step) {
        var _this = _super.call(this, step === Math.floor(step), // i.e. is this an integer?
        PROGRESSION_TYPENAME) || this;
        //NOTE: This is not a constructor-private because we need to send the constructor arg into super().
        _this._step = 0;
        _this._step = step;
        return _this;
    }
    LinearProgression.prototype.Advance = function () {
        this._value += this._step;
    };
    return LinearProgression;
}(Progression_1.Progression));
exports.LinearProgression = LinearProgression;
Object.freeze(LinearProgression);
//# sourceMappingURL=LinearProgression.js.map