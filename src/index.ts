import { splitMedia } from "./media-splitter";

splitMedia({
  inputFile: `${__dirname}/input/sample.mp4`,
  outputDir: `${__dirname}/dist`,
  outputFileName: (index) => `sample-${index}.mp4`,
  splitDurationMs: 600,
});
