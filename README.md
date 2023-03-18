# media-splitter

The library to split media file like video and audio

## Installation

You need to install `ffmpeg` to use this package.

```sh
$ brew install ffmpeg
```

Install npm package if you use this package in Node.js.

```sh
# as a local package
$ npm install media-splitter

# as a global package
$ npm install -g media-splitter
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
