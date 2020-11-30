'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelParams = void 0;
var Utils_1 = require("./Utils");
var ModelParams = /** @class */ (function () {
    function ModelParams(_dynamicParams, _staticParams) {
        this._dynamicParams = _dynamicParams;
        this._staticParams = _staticParams;
        this._mergedParams = {};
        // start off with a (shallow) clone of the statics...
        this._mergedParams = Object.assign({}, this._staticParams);
        // ...then merge in the dynamics, throwing in the event of a collision
        for (var k in this._dynamicParams) {
            if (this._mergedParams[k] !== undefined) {
                throw new Error('Merging model params with a dynamic-static collision (these are mutually exclusive); key: ' + k);
            }
            this._mergedParams[k] = this._dynamicParams[k];
        }
    }
    ModelParams.prototype.GetBooleanParam = function (key) {
        this.ValidateParamKey(key);
        if (typeof this._mergedParams[key] !== 'boolean') {
            throw new Error('param ' + key + ' is not Boolean: ' + this._mergedParams[key]);
        }
        return Boolean(this._mergedParams[key]);
    };
    ModelParams.prototype.GetNumericParam = function (key) {
        this.ValidateParamKey(key);
        if (typeof this._mergedParams[key] !== 'number') {
            throw new Error('param ' + key + ' is not a number: ' + this._mergedParams[key]);
        }
        return Number(this._mergedParams[key]);
    };
    ModelParams.prototype.GetTextParam = function (key) {
        this.ValidateParamKey(key);
        if (typeof this._mergedParams[key] !== 'string') {
            throw new Error('param ' + key + ' is not a string: ' + this._mergedParams[key]);
        }
        return String(this._mergedParams[key]);
    };
    ModelParams.prototype.ValidateParamKey = function (key) {
        console.assert(key !== '');
        if (this._mergedParams[key] === undefined) {
            throw new Error('ModelParams key not found: ' + key);
        }
    };
    //vv TODO: These move into a CSVSource interface
    ModelParams.prototype.WriteCSVLineKeys = function () {
        var textOut = '';
        for (var k in this._mergedParams) {
            textOut += k + ',';
        }
        // drop the trailing comma
        textOut = textOut.slice(0, -1);
        return textOut;
    };
    ModelParams.prototype.WriteCSVLineValues = function () {
        var textOut = '';
        for (var k in this._mergedParams) {
            // check every string for file-breakers, while we're here
            //PERF: This is potentially overkill (we validate these early on in their lifecycle), and it _could_ matter.
            //		I'm keeping it because that initial validation is not done w/ CSV writes in mind. It's much more focused
            //		on proper uint/bool/string.
            //		Redundancy is good, but if our file writes become perceptibly slower, this can go.
            Utils_1.Utils.ValidateTextForCSV(this._mergedParams[k]);
            textOut += this._mergedParams[k] + ',';
        }
        // drop the trailing comma
        textOut = textOut.slice(0, -1);
        return textOut;
    };
    return ModelParams;
}());
exports.ModelParams = ModelParams;
Object.freeze(ModelParams);
//# sourceMappingURL=ModelParams.js.map