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
exports.ExponentialProgression = void 0;
var Progression_1 = require("../Progression");
var PROGRESSION_TYPENAME = 'Exponential';
var ExponentialProgression = /** @class */ (function (_super) {
    __extends(ExponentialProgression, _super);
    function ExponentialProgression(exponent, scale) {
        var _this = _super.call(this, exponent === Math.floor(exponent) && scale === Math.floor(scale), // i.e. are these integers?
        PROGRESSION_TYPENAME) || this;
        //NOTE: These are not constructor-privates because we need to send the constructor's args into super().
        _this._exponent = 0;
        _this._scale = 0;
        _this._step = 0;
        // these rules prevent the progression going flat (infinite) or negative (yikes)
        //NOTE: We could support whackier curves, and will if requested. I don't anticipate that desire, but who knows.
        //		Also, the user may create a negative progression by inverting their Axis bounds; send a boundBegin > boundEnd.
        console.assert(exponent > 1.0);
        console.assert(scale > 0.0);
        _this._exponent = exponent;
        _this._scale = scale;
        // this initializes '_step'
        _this.ResetStep();
        return _this;
    }
    ExponentialProgression.prototype.Advance = function () {
        this._value = this._scale * Math.pow(this._exponent, this._step);
        ++this._step;
    };
    ExponentialProgression.prototype.Reset = function () {
        _super.prototype.Reset.call(this);
        this.ResetStep();
    };
    ExponentialProgression.prototype.ResetStep = function () {
        this._step = 0;
    };
    return ExponentialProgression;
}(Progression_1.Progression));
exports.ExponentialProgression = ExponentialProgression;
Object.freeze(ExponentialProgression);
//# sourceMappingURL=ExponentialProgression.js.map