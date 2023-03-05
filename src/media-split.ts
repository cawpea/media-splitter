// ref: https://www.youtube.com/watch?v=HPmlGVwd-Fo
import ffmpeg from "fluent-ffmpeg";

const inputFile = `${__dirname}/input/sample.mp4`;
const outputDir = `${__dirname}/dist`;

// NOTE: 分割する際の1つの動画あたりの秒数
const splitDuration = 600;

const createMedia = (
  startingTime: number,
  duration: number,
  fileName: string
) => {
  ffmpeg()
    .input(inputFile)
    .inputOptions([`-ss ${startingTime}`])
    .outputOptions([`-t ${duration}`])
    .output(`${outputDir}/${fileName}`)
    .on("end", () => console.log(`created ${outputDir}/${fileName}`))
    .on("error", (err) => console.error(err))
    .run();
};

export const splitMedia = () => {
  ffmpeg.ffprobe(inputFile, (err, metaData) => {
    console.log("ffprobe", metaData);
    const { duration } = metaData.format;

    if (!duration) {
      throw Error("does not exist duration");
    }

    const totalFileLength = Math.ceil(duration / splitDuration);

    for (let i = 0; i < totalFileLength; i++) {
      createMedia(i * splitDuration, splitDuration, `sample-${i}.mp4`);
    }
  });
};
