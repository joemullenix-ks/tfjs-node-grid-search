import { FileIOResult } from './FileIOResult';
declare const FILE_IO: {
    ProduceResultsFilename: () => string;
    ReadDataFile: (path: string, result: FileIOResult) => Promise<void>;
    WriteResultsFile: (fileName: string, directory: string, dataToWrite: string) => Promise<void>;
};
export { FILE_IO as FileIO };
