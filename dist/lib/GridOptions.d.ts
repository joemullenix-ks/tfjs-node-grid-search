import * as Types from '../ts_types/common';
declare class GridOptions {
    private _options;
    constructor(userOptions?: Types.StringKeyedSimpleObject);
    GetOption(key: string): string | number | boolean | undefined;
}
export { GridOptions };
