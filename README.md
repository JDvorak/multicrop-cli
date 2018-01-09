# multi-crop [![stability][0]][1]
[![downloads][8]][9] [![js-standard-style][10]][11]

A poor man's dataset preparation tool. This tool abuses the excellent smartcrop tool to iterate over images in a directory and produce large sets of diverse yet data rich crops of images. Most, if not all, of its parts will eventually be cannibalized from this repository. However, the CLI is stable. 

## Usage
```bash
$ multi-crop --width 32 --height 32 --limit 100 sourcedir targetdir
```
Will iterate over images in `sourcedir` and produce a maximum of a 100 crops each for every image and write them to `targetdir` (they will be 32x32 pixels). Each crop will be the best crop for a given region of the image, and has smart defaults for photos of people. 

For more information, run help:
```bash
$ multi-crop --help
Usage: multi-crop [OPTION] INPUT OUTPUT

Options:
  --help          Show help                                            [boolean]
  --version       Show version number                                  [boolean]
  --width         width of the crop
  --height        height of the crop
  --outputFormat  image magick output format string             [default: "jpg"]
  --quality       jpeg quality of the output image                 [default: 90]
  -*              forwarded as options to smartcrop.js

Examples:
  index.js --width 32 --height 32           generate a variable number of 32x32
  input/*.jpg output/                       crops from all images matching glob
  index.js --width 64 --height 64           generate a variable number of 64x64
  --outputFormat png input/*.jpg output/    crops, converted to PNG, from all
                                            images matching glob
  index.js --width 128 --height 128         generate no more than 10 128x128
  --limit 10 input/*.jpg output/            pngcrops from all images matching
                                            glob
  index.js --width 256 --height 256 input   generate 256x256 crops from all
  output/                                   images in the directory input
```

## API
### multiCrop

## API IS NEITHER STABLE NOR INTENDED FOR HUMAN CONSUMPTION, USE AT YOUR RISK

## Dependencies

The underlying smartcrop dependency requires image magick to operate. On Debian based systems `apt-get install imagemagick` on mac os `brew install imagemagick,` and on windows, please wait while I finish substituting the imagemagick dependency with a dependency on [sharp](https://github.com/lovell/sharp).

## Installation

```sh
$ npm install -g multi-crop
```

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/multi-crop.svg?style=flat-square
[3]: https://npmjs.org/package/multi-crop
[4]: https://img.shields.io/travis/jdvorak/multi-crop/master.svg?style=flat-square
[5]: https://travis-ci.org/jdvorak/multi-crop
[6]: https://img.shields.io/codecov/c/github/jdvorak/multi-crop/master.svg?style=flat-square
[7]: https://codecov.io/github/jdvorak/multi-crop
[8]: http://img.shields.io/npm/dm/multi-crop.svg?style=flat-square
[9]: https://npmjs.org/package/multi-crop
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
