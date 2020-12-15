import * as Types from './types';
/**
 * Merges two sets of params, dynamic and static, that will be used to create
 * a network model.
 */
declare class ModelParams {
    private _dynamicParams;
    private _staticParams;
    private _mergedParams;
    /**
     * Creates an instance of ModelParams.
     * @param {Types.StringKeyedSimpleObject} _dynamicParams
     * @param {Types.StringKeyedSimpleObject} _staticParams
     */
    constructor(_dynamicParams: Types.StringKeyedSimpleObject, _staticParams: Types.StringKeyedSimpleObject);
    /**
     * Retrieve a Boolean param's value.
     * @param {string} key
     * @return {boolean}
     */
    GetBooleanParam(key: string): boolean;
    /**
     * Retrieve a number param's value.
     * @param {string} key
     * @return {number}
     */
    GetNumericParam(key: string): number;
    /**
     * Retrieve a string param's value.
     * @param {string} key
     * @return {string}
     */
    GetTextParam(key: string): string;
    /**
     * Throws if a param key is not supported. This is exceptional because the
     * objects our constructor takes are not user input. They've been processed.
     * @private
     * @param {string} key
     */
    private ValidateParamKey;
    WriteCSVLineKeys(): string;
    WriteCSVLineValues(): string;
}
export { ModelParams };
