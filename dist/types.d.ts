export type SplitMediaProps = {
    inputFile: string;
    outputDir?: string;
    outputFileName?: (index: number, defaultName: string, ext?: string) => string;
    splitDurationMs?: number;
    onProgress?: (index: number, total: number) => void;
};
