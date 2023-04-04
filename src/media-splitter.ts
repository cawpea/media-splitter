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
): Promise<{ outputFilePath: string }> => {
  const outputFilePath = `${outputDir}/${fileName}`;

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputFile)
      .inputOptions([`-ss ${startingTime}`])
      .outputOptions([`-t ${duration}`])
      .output(outputFilePath)
      .on("end", () => {
        console.log(`media-splitter: created ${outputFilePath}`);
        resolve({ outputFilePath });
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
  outputDir = `${__dirname}/media-splitter-dist`,
  outputFileName = (index, defaultName, ext) =>
    `${defaultName}-${index}.${ext}`,
  splitDurationMs = 600,
  onProgress,
}: SplitMediaProps): Promise<string[]> => {
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
      let outputFilePaths: string[] = [];

      Array.from(Array(totalFileLength).keys()).map((i) => {
        createMedia(
          inputFile,
          outputDir,
          i * splitDurationMs,
          splitDurationMs,
          outputFileName(i, inputFileName, inputFileExt)
        )
          .then(({ outputFilePath }) => {
            outputFilePaths.push(outputFilePath);
            if (onProgress) {
              onProgress(i, totalFileLength);
            }
            if (outputFilePaths.length === totalFileLength) {
              resolve(outputFilePaths.sort());
              console.log("media-splitter: completed");
            }
          })
          .catch((e) => {
            reject(e);
          });
      });
    });
  });
};
