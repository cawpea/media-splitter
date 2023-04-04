#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const media_splitter_1 = require("./media-splitter");
commander_1.program
    .option("-i, --input <optionValue>", "file path of media")
    .option("-o, --output <optionValue>", "directory path of output", "./media-splitter-dist")
    .option("-n, --name <optionValue>", "name of output file, it's assigned sequential numbers automatically")
    .option("-s, --split <optionValue>", "duration to split media file", "600");
commander_1.program.parse();
const options = commander_1.program.opts();
console.log("media-splitter: ", options);
(0, media_splitter_1.splitMedia)({
    inputFile: options.input,
    outputDir: options.output,
    outputFileName: (index, defaultName, ext) => options.name
        ? `${options.name}-${index}.${ext}`
        : `${defaultName}-${index}.${ext}`,
    splitDurationMs: Number(options.split),
});
//# sourceMappingURL=command.js.map