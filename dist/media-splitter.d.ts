import { SplitMediaProps } from "./types";
export declare const splitMedia: ({ inputFile, outputDir, outputFileName, splitDurationMs, onProgress, }: SplitMediaProps) => Promise<string[]>;
