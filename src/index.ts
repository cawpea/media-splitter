import { program } from "commander";
import { splitMedia } from "./media-splitter";

program
  .option("-i, --input <optionValue>", "読み込むファイル")
  .option(
    "-o, --output <optionValue>",
    "出力先のディレクトリ",
    "./media-splitter"
  )
  .option(
    "-n, --name <optionValue>",
    "出力されるファイル名（デフォルトではinputのファイル名に連番を付与します）"
  )
  .option("-s, --split <optionValue>", "分割単位のミリ秒", "600");
program.parse();

const options = program.opts();

console.log("input", options);

splitMedia({
  inputFile: options.input,
  outputDir: options.output,
  outputFileName: (index, defaultName) =>
    options.name ? `${options.name}-${index}` : `${defaultName}-${index}`,
  splitDurationMs: Number(options.split),
});
