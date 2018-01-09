var glob = require('pull-glob')
var pull = require('pull-stream')
var pullCrop = require('./pull-crop')
var selectCrops = require('./selectCrops')
var pullSmartcrop = require('./pull-smartcrop')

// IF loaded as a module

module.exports = {
  _crop: pullCrop,
  _select: selectCrops,
  _smartcrop: pullSmartcrop
}

// IF Loaded On its Own

var argv = require('yargs')
  .usage('Usage: $0 [OPTION] GLOB [OUTPUT]')
  .example('$0 --width 32 --height 32 input/*.jpg output/', 'generate a variable number of 32x32 crops from all images matching glob')
  .example('$0 --width 64 --height 64 --outputFormat png input/*.jpg output/', 'generate a variable number of 64x64 crops, converted to PNG, from all images matching glob')
  .example('$0 --width 128 --height 128 --limit 10 input/*.jpg output/', 'generate no more than 10 128x128 pngcrops from all images matching glob')
  .example('$0 --width 256 --height 256 input output/', 'generate 256x256 crops from all images in the directory input')
  .defaults('quality', 90)
  .defaults('outputFormat', 'jpg')
  .describe({
    width: 'width of the crop',
    height: 'height of the crop',
    outputFormat: 'image magick output format string',
    quality: 'jpeg quality of the output image',
    '*': 'forwarded as options to smartcrop.js'
  })
  .argv

argv.input = argv._.slice(0, argv._.length - 1)
argv.output = argv._[argv._.length - 1]

function walk (input) {
  return glob(input + '/*')
}

var source = pull.values(argv.input) // If system glob

if (argv.input.length === 1) {
  source = walk(argv.input) // If directory is provided, or string glob
}

pull(
  source,
  pullSmartcrop(argv),
  selectCrops(argv),
  pullCrop(argv),
  pull.drain()
)
