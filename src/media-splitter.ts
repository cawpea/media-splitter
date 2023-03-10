// ref: https://www.youtube.com/watch?v=HPmlGVwd-Fo
import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import { SplitMediaProps } from "./types";

const createDir = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

const createMedia = (
  inputFile: string,
  outputDir: string,
  startingTime: number,
  duration: number,
  fileName: string
) => {
  const outputFilePath = `${outputDir}/${fileName}`;

  ffmpeg()
    .input(inputFile)
    .inputOptions([`-ss ${startingTime}`])
    .outputOptions([`-t ${duration}`])
    .output(outputFilePath)
    .on("end", () => console.log(`media-splitter: created ${outputFilePath}`))
    .on("error", (err) => console.error(err))
    .run();
};

export const splitMedia = ({
  inputFile,
  outputDir,
  outputFileName,
  splitDurationMs,
}: SplitMediaProps) => {
  const inputFileName = inputFile.split("/").pop()?.split(".")[0] ?? "";
  const inputFileExt = inputFile.split(".").pop();

  ffmpeg.ffprobe(inputFile, (err, metaData) => {
    if (err) throw err;

    if (!metaData) {
      throw Error("could not get metadata from input file");
    }

    const { duration } = metaData.format;
    if (!duration) {
      throw Error("does not exist duration");
    }

    createDir(outputDir);

    const totalFileLength = Math.ceil(duration / splitDurationMs);

    for (let i = 0; i < totalFileLength; i++) {
      createMedia(
        inputFile,
        outputDir,
        i * splitDurationMs,
        splitDurationMs,
        `${outputFileName(i, inputFileName)}.${inputFileExt}`
      );
    }
  });
};
