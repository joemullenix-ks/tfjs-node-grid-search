'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelParams = void 0;
const Utils_1 = require("./Utils");
/**
 * Merges two sets of params, dynamic and static, that will be used to create
 * a network model.
 */
class ModelParams {
    /**
     * Creates an instance of ModelParams.
     * @param {Types.StringKeyedSimpleObject} _dynamicParams
     * @param {Types.StringKeyedSimpleObject} _staticParams
     */
    constructor(_dynamicParams, _staticParams) {
        this._dynamicParams = _dynamicParams;
        this._staticParams = _staticParams;
        this._mergedParams = {};
        // start off with a (shallow) clone of the statics...
        this._mergedParams = Object.assign({}, this._staticParams);
        // ...then merge in the dynamics, throwing in the event of a collision
        for (const k in this._dynamicParams) {
            if (this._mergedParams[k] !== undefined) {
                throw new Error('Merging model params with a dynamic-static collision (these are mutually exclusive); key: ' + k);
            }
            this._mergedParams[k] = this._dynamicParams[k];
        }
    }
    /**
     * Retrieve a Boolean param's value.
     * @param {string} key
     * @return {boolean}
     */
    GetBooleanParam(key) {
        this.ValidateParamKey(key);
        if (typeof this._mergedParams[key] !== 'boolean') {
            throw new Error('param ' + key + ' is not Boolean: ' + this._mergedParams[key]);
        }
        return Boolean(this._mergedParams[key]);
    }
    /**
     * Retrieve a number param's value.
     * @param {string} key
     * @return {number}
     */
    GetNumericParam(key) {
        this.ValidateParamKey(key);
        if (typeof this._mergedParams[key] !== 'number') {
            throw new Error('param ' + key + ' is not a number: ' + this._mergedParams[key]);
        }
        return Number(this._mergedParams[key]);
    }
    /**
     * Retrieve a string param's value.
     * @param {string} key
     * @return {string}
     */
    GetTextParam(key) {
        this.ValidateParamKey(key);
        if (typeof this._mergedParams[key] !== 'string') {
            throw new Error('param ' + key + ' is not a string: ' + this._mergedParams[key]);
        }
        return String(this._mergedParams[key]);
    }
    /**
     * Throws if a param key is not supported. This is exceptional because the
     * objects our constructor takes are not user input. They've been processed.
     * @param {string} key
     */
    ValidateParamKey(key) {
        console.assert(key !== '');
        if (this._mergedParams[key] === undefined) {
            throw new Error('ModelParams key not found: ' + key);
        }
    }
    //vv TODO: These move into a CSVSource interface
    WriteCSVLineKeys() {
        let textOut = '';
        for (const k in this._mergedParams) {
            textOut += k + ',';
        }
        // drop the trailing comma
        textOut = textOut.slice(0, -1);
        return textOut;
    }
    WriteCSVLineValues() {
        let textOut = '';
        for (const k in this._mergedParams) {
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
    }
}
exports.ModelParams = ModelParams;
Object.freeze(ModelParams);
//# sourceMappingURL=ModelParams.js.map