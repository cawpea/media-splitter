export type SplitMediaProps = {
    inputFile: string;
    outputDir: string;
    outputFileName: (index: number, defaultName: string) => string;
    splitDurationMs: number;
};
