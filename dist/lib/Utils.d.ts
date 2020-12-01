declare const UTILS: {
    ArrayCalculateAverage: (array: Array<number>) => number;
    ArrayFindIndexOfHighestValue: (values: Array<number>) => number;
    CheckNonNegativeInteger: (x: number) => boolean;
    CheckFloat0to1Exclusive: (x: number) => boolean;
    CheckPositiveInteger: (x: number) => boolean;
    QueueRotate: (queue: Array<number>, newSample: number, count: number) => void;
    ThrowCaughtUnknown: (messagePrefix: string, errorOrException: unknown) => void;
    ValidateTextForCSV: (x: string | number | boolean) => void;
    WriteDurationReport: (durationMS: number) => string;
};
export { UTILS as Utils };
