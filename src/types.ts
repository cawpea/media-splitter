export type SplitMediaProps = {
  inputFile: string;
  outputDir: string;
  outputFileName: (index: number) => string;
  splitDurationMs: number;
};
