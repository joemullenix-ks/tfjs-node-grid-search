/**
 * Simple class for saving data from file reads.
 */
declare class FileIOResult {
    private _data;
    /**
     * Creates an instance of FileIOResult.
     */
    constructor();
    get data(): string;
    set data(data: string);
}
export { FileIOResult };
