const stdev = require('compute-stdev')
const computeMean = require('compute-mean')

function findBoundaries (arr, accessor, options) {
  var scored = arr.map(accessor)
  var windowSize = Math.floor(options.windowSize || 5)
  var smoothing = options.smoothing || 0.0

  function smooth (values, smoothing) {
    var value = values[0]
    for (var i = 1; i < values.length; i++) {
      var currentValue = values[i]
      value += (currentValue - value) * smoothing
      values[i] = value
    }
    return values
  }

  function getDepthScore (location) {
    var highLeft = findPeak(location, -1, scored)
    var highRight = findPeak(location, 1, scored)
    var depth = ((highLeft - scored[location]) + (highRight - scored[location])) / 2
    return depth
  }

  function findPeak (location, direction, arr) {
    var maxValue = 0
    var newValue = 0
    var nextIndex

    for (var steps = 1; arr[location + (steps * direction)]; steps++) {
      nextIndex = location + (steps * direction)
      if (arr[nextIndex] != null) {
        newValue = arr[nextIndex]
        if (newValue > maxValue) {
          maxValue = newValue
          continue
        }
      }
      return maxValue
    }

    return maxValue
  }

  function isBoundary (depth, location) {
    if (depth > findPeak(location, -1, depths) && depth > findPeak(location, 1, depths)) {
      if (stdeviation > mean) {
        return depth > (mean + stdeviation / 2)
      } else {
        return depth < (mean - stdeviation / 2)
      }
    }
  }

  var depths = scored.map(function (ea, i) { return getDepthScore(i) })

  if (smoothing > 0.0) {
    depths = smooth(depths, smoothing)
  }

  var mean = computeMean(depths)
  var stdeviation = stdev(depths)

  var boundaries = depths.reduce(function (arr, cur, i) {
    var last = arr.length - 1
    var previousCur = arr[last] && arr[last].value
    if (isBoundary(cur, i)) {
      if (arr[last] && cur > previousCur && arr[last].location > i - (windowSize / 2) && arr[last].location < i + (windowSize / 2)) {
        arr[arr.length - 1] = {location: i, value: cur}
      } else if (arr[last] && cur < previousCur && arr[last].location > i - (windowSize / 2) && arr[last].location < i + (windowSize / 2)) {
        return arr
      } else {
        arr.push({location: i, value: cur})
      }
    }
    return arr
  }, [])
  return boundaries.map(function (ea, i, boundaries) {
    var boundary = ea.location
    var chunk
    if (i === boundaries.length - 1) {
      chunk = arr.slice(boundary, boundaries.length - 1)
    } else {
      chunk = arr.slice(boundary, boundaries[i + 1].location)
    }
    return chunk
  })
}

module.exports = findBoundaries
