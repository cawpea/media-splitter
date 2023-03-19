"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitMedia = void 0;
// ref: https://www.youtube.com/watch?v=HPmlGVwd-Fo
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const fs = __importStar(require("fs"));
const createDir = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};
const createMedia = (inputFile, outputDir, startingTime, duration, fileName) => {
    const outputFilePath = `${outputDir}/${fileName}`;
    return new Promise((resolve, reject) => {
        (0, fluent_ffmpeg_1.default)()
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
const splitMedia = async ({ inputFile, outputDir = "media-splitter-dist", outputFileName = (index, defaultName) => `${defaultName}-${index}`, splitDurationMs = 600, onProgress, }) => {
    const inputFileName = inputFile.split("/").pop()?.split(".")[0] ?? "";
    const inputFileExt = inputFile.split(".").pop();
    return new Promise((resolve, reject) => {
        fluent_ffmpeg_1.default.ffprobe(inputFile, (err, metaData) => {
            if (err)
                throw err;
            if (!metaData) {
                throw Error("could not get metadata from input file");
            }
            const { duration } = metaData.format;
            if (!duration) {
                throw Error("does not exist duration");
            }
            createDir(outputDir);
            const totalFileLength = Math.ceil(duration / splitDurationMs);
            let outputFilePaths = [];
            Array.from(Array(totalFileLength).keys()).map((i) => {
                createMedia(inputFile, outputDir, i * splitDurationMs, splitDurationMs, `${outputFileName(i, inputFileName)}.${inputFileExt}`)
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
exports.splitMedia = splitMedia;
//# sourceMappingURL=media-splitter.js.map