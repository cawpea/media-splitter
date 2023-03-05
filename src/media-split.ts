import ffmpeg from "fluent-ffmpeg";

const inputFile = `${__dirname}/data/sample.mp4`;
const outputDir = `${__dirname}/data`;

export const splitMedia = () => {
  ffmpeg.ffprobe(inputFile, (err, metaData) => {
    console.log("ffprobe", metaData);
    const { duration } = metaData.format;

    if (!duration) {
      throw Error("does not exist duration");
    }

    const startingTime = duration / 2;
    const clipDuration = 5;

    ffmpeg()
      .input(inputFile)
      .inputOptions([`-ss ${startingTime}`])
      .outputOptions([`-t ${clipDuration}`])
      .output(`${outputDir}/sample2.mp4`)
      .on("end", () => console.log("Done!"))
      .on("error", (err) => console.error(err))
      .run();
  });
};
