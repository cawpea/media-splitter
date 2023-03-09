# media-splitter

The library to split media file like video and audio

## Installation

```sh
$ npm install media-splitter
```

## Usage

### Node.js

You can use it by import.

```js
import { splitMedia } from "media-splitter";

splitMedia({
  inputFile: "./sample.mp4",
  outputDir: "./dist",
  outputFileName: (index, defaultName) => `${defaultName}-${index}`,
  splitDurationMs: 600,
});
```

### CLI Command

You can also use it by command.

```sh
$ npx media-splitter -i ./sample.mp4
```

#### Options

- -i, --input <optionValue> file path of media
- -o, --output <optionValue> directory path of output (default: "./media-splitter-dist")
- -n, --name <optionValue> name of output file, it's assigned sequential numbers automatically
- -s, --split <optionValue> duration to split media file (default: "600")
- -h, --help display help for command
