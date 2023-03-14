"use strict";
exports.__esModule = true;
exports.splitMedia = void 0;
// ref: https://www.youtube.com/watch?v=HPmlGVwd-Fo
var fluent_ffmpeg_1 = require("fluent-ffmpeg");
var fs = require("fs");
var createDir = function (path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};
var createMedia = function (inputFile, outputDir, startingTime, duration, fileName) {
    var outputFilePath = "".concat(outputDir, "/").concat(fileName);
    (0, fluent_ffmpeg_1["default"])()
        .input(inputFile)
        .inputOptions(["-ss ".concat(startingTime)])
        .outputOptions(["-t ".concat(duration)])
        .output(outputFilePath)
        .on("end", function () { return console.log("media-splitter: created ".concat(outputFilePath)); })
        .on("error", function (err) { return console.error(err); })
        .run();
};
var splitMedia = function (_a) {
    var _b, _c;
    var inputFile = _a.inputFile, outputDir = _a.outputDir, outputFileName = _a.outputFileName, splitDurationMs = _a.splitDurationMs;
    var inputFileName = (_c = (_b = inputFile.split("/").pop()) === null || _b === void 0 ? void 0 : _b.split(".")[0]) !== null && _c !== void 0 ? _c : "";
    var inputFileExt = inputFile.split(".").pop();
    fluent_ffmpeg_1["default"].ffprobe(inputFile, function (err, metaData) {
        if (err)
            throw err;
        if (!metaData) {
            throw Error("could not get metadata from input file");
        }
        var duration = metaData.format.duration;
        if (!duration) {
            throw Error("does not exist duration");
        }
        createDir(outputDir);
        var totalFileLength = Math.ceil(duration / splitDurationMs);
        for (var i = 0; i < totalFileLength; i++) {
            createMedia(inputFile, outputDir, i * splitDurationMs, splitDurationMs, "".concat(outputFileName(i, inputFileName), ".").concat(inputFileExt));
        }
    });
};
exports.splitMedia = splitMedia;
