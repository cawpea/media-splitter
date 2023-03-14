#!/usr/bin/env node
import { program } from "commander";
import { splitMedia } from "./media-splitter";

program
  .option("-i, --input <optionValue>", "file path of media")
  .option(
    "-o, --output <optionValue>",
    "directory path of output",
    "./media-splitter-dist"
  )
  .option(
    "-n, --name <optionValue>",
    "name of output file, it's assigned sequential numbers automatically"
  )
  .option("-s, --split <optionValue>", "duration to split media file", "600");
program.parse();

const options = program.opts();

console.log("media-splitter: ", options);

splitMedia({
  inputFile: options.input,
  outputDir: options.output,
  outputFileName: (index, defaultName) =>
    options.name ? `${options.name}-${index}` : `${defaultName}-${index}`,
  splitDurationMs: Number(options.split),
});
