const test = require('tape')
const modul = require('../selectCrops')

test('should retrieve max of an array', function (t) {
  t.plan(1)
  t.assert(modul.getMax([0, 1, 10, 1, 2]) === 10, 'getMax retrieves maximum of an array')
})

test('should retrieve max of an array', function (t) {
  t.plan(2)
  var peaks = modul.getPeaks([[0, 1, 10, 1, 2]])
  t.assert(peaks[0] === 10, 'getPeaks generates array of only peak values from individual arrays')
  peaks = modul.getPeaks([[0, 1, 10, 1, 2], [0, 1, 11, 1, 2], [0, 1, 12, 1, 2]])
  t.assert(peaks[0] === 10 && peaks[1] === 11 && peaks[2] === 12, 'getPeaks keeps order')
})
