var findTroughs = require('./findTroughs')
var pull = require('pull-stream')

function getMax (arr, fn) {
  fn = fn || function (a, b) { return b - a }
  return arr.sort(fn)[0]
}

function getPeaks (troughs, fn) {
  return troughs.reduce(function getPeaks (arr, ea) {
    arr.push(getMax(ea, fn))
    return arr
  }, [])
}

function _setOptions (argv) {
  var options = {
    windowModifier: 1.0
  }

  return options
}

function selectCrops (argv) {
  var options = _setOptions(argv)

  function retrieveDetails (ea) {
    return ea.score.detail
  }

  function sortScoreTotal (a, b) {
    return b.score.total - a.score.total
  }

  return pull.map(function _selectCrops (crops) {
    options.windowSize = options.windowModifier * crops.debugOutput.width / 3

    return {
      input: crops.input,
      output: crops.output,
      list: getPeaks(findTroughs(crops.crops, retrieveDetails, options), sortScoreTotal)
    }
  })
}

module.exports = selectCrops
module.exports.getPeaks = getPeaks
module.exports.getMax = getMax
module.exports._setOptions = _setOptions
