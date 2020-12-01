import * as Types from '../ts_types/common';
declare class ModelParams {
    private _dynamicParams;
    private _staticParams;
    private _mergedParams;
    constructor(_dynamicParams: Types.StringKeyedSimpleObject, _staticParams: Types.StringKeyedSimpleObject);
    GetBooleanParam(key: string): boolean;
    GetNumericParam(key: string): number;
    GetTextParam(key: string): string;
    ValidateParamKey(key: string): void;
    WriteCSVLineKeys(): string;
    WriteCSVLineValues(): string;
}
export { ModelParams };
