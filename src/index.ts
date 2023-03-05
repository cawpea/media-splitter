import { splitMedia } from "./media-splitter";

splitMedia({
  inputFile: `${__dirname}/input/sample.mp4`,
  outputDir: `${__dirname}/dist`,
  splitDurationMs: 600,
});
