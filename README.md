# media-splitter

The library to split media file like video and audio

## Installation

```sh
$ npm install media-splitter
```

## Usage

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

and You can also use it by command.

```sh
$ npx media-splitter -i ./sample.mp4
```
