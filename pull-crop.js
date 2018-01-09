var gm = require('gm').subClass({ imageMagick: true })
var flatmap = require('pull-flatmap')
var paramap = require('pull-paramap')
var pull = require('pull-stream')
var path = require('path')

function _filepath (i, output, input, format) {
  return path.join(path.resolve(output), `${path.basename(input).split('.')[0]}_${i}`)
}

function filterBadCrops (crop) {
  if (crop == null) return false
  if (crop.score <= -0.001) return false
  return true
}

function fanCrops () {
  return flatmap(function _fanCrops (cuts) {
    var input = cuts.input
    var output = cuts.output

    return cuts.list
    .filter((crop) => { return crop != null })
    .map(function specifyEach (crop, i) {
      return {
        input: input,
        score: crop.score.total,
        width: crop.width,
        height: crop.height,
        x: crop.x,
        y: crop.y,
        output: _filepath(i, output, input)
      }
    })
  })
}

function _setOptions (argv) {
  var options = {
    height: argv.height,
    width: argv.width,
    quality: argv.quality,
    format: argv.outputFormat
  }

  return options
}

function cropAll (argv) {
  return pull(
    fanCrops(argv),
    pull.filter(filterBadCrops),
    pullCrop(argv)
  )
}

function pullCrop (argv) {
  var options = _setOptions(argv)
  console.log(options)
  return paramap(function _crop (spec, cb) {
    var cmd = gm(spec.input)
        .setFormat(options.format)
        .crop(spec.width, spec.height, spec.x, spec.y)
        .resize(options.width, options.height)
        .unsharp('2x0.5+1+0.008')
        .colorspace('sRGB')
        .autoOrient()
        .strip()

    if (options.quality) {
      cmd = cmd.quality(options.quality)
    }

    // TODO: Replace this with a stream which potentially pipes to stdout
    cmd.write(`${spec.output}.${options.format}`, cb)
  })
}

module.exports = cropAll
module.exports.crop = pullCrop
module.exports.fanCrops = fanCrops
module.exports._filepath = _filepath
module.exports.filterBadCrops = filterBadCrops
module.exports._setOptions = _setOptions
