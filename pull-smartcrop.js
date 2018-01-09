var smartcrop = require('smartcrop-gm')
var xtend = require('xtend')
var pull = require('pull-stream')
var _ = require('underscore')

function pullSmartcrop (argv) {
  var options = _setOptions(argv)

  return pull.asyncMap(function (input, cb) {
    smartcrop.crop(input, options).then(
      function (crops) {
        crops.input = input
        crops.output = options.output
        cb(null, crops)
      },
      cb)
  })
}

function _setOptions (argv) {
  var options = xtend(
    {
      // TODO: Document options passthrough and defaults.
      minScale: 0.25,
      maxScale: 10,
      saturationWeight: 0.0,
      saturationBias: 0.0,
      skinBias: 0.4
    },
    argv.config,
    _.omit(argv, 'config', 'quality', 'faceDetection'),
    {
      debug: true, // Provides us an array of all the checked crops.
      output: argv.output
    }
  )

  return options
}

module.exports = pullSmartcrop
module.exports._setOptions = _setOptions
