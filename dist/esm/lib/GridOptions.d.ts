import * as Types from './types';
declare class GridOptions {
    private _options;
    constructor(userOptions?: Types.StringKeyedSimpleObject);
    GetOption(key: string): string | number | boolean | undefined;
}
export { GridOptions };
