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
): Promise<void> => {
  const outputFilePath = `${outputDir}/${fileName}`;

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputFile)
      .inputOptions([`-ss ${startingTime}`])
      .outputOptions([`-t ${duration}`])
      .output(outputFilePath)
      .on("end", () => {
        console.log(`media-splitter: created ${outputFilePath}`);
        resolve();
      })
      .on("error", (err) => {
        console.error(err);
        reject();
      })
      .run();
  });
};

export const splitMedia = async ({
  inputFile,
  outputDir = "media-splitter-dist",
  outputFileName = (index, defaultName) => `${defaultName}-${index}`,
  splitDurationMs = 600,
  onProgress,
  onComplete,
  onError,
}: SplitMediaProps): Promise<void> => {
  const inputFileName = inputFile.split("/").pop()?.split(".")[0] ?? "";
  const inputFileExt = inputFile.split(".").pop();

  return new Promise((resolve, reject) => {
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
      let createdFileIndex = [];

      Array.from(Array(totalFileLength).keys()).map((i) => {
        createMedia(
          inputFile,
          outputDir,
          i * splitDurationMs,
          splitDurationMs,
          `${outputFileName(i, inputFileName)}.${inputFileExt}`
        )
          .then(() => {
            createdFileIndex.push(i);
            if (onProgress) {
              onProgress(i, totalFileLength);
            }
            if (createdFileIndex.length === totalFileLength) {
              if (onComplete) {
                onComplete(totalFileLength);
              }
              console.log("media-splitter: completed");
            }
          })
          .catch((e) => {
            if (onError) onError(e);
          });
      });
    });
  });
};
