const test = require('tape')
const crop = require('../crop')
const pull = require('pull-stream')

function generateFakeCrop () {
  return {
    width: Math.random(),
    height: Math.random(),
    x: Math.random(),
    y: Math.random(),
    score: {
      total: Math.random()
    }
  }
}

test('should provide four public functions', function (t) {
  t.plan(4)
  t.assert(crop.crop instanceof Function, 'crop is a method')
  t.assert(crop.fanCrops instanceof Function, 'fanCrop is a method')
  t.assert(crop.filterBadCrops instanceof Function, 'filterBadCrops is a method')
  t.assert(crop instanceof Function, 'module exports a function')
})

test('_setOptions should extract necessary options from argv', function (t) {
  t.plan(4)
  let argv = {
    height: Math.random(),
    width: Math.random(),
    quality: Math.random(),
    outputFormat: Math.random()
  }

  let options = crop._setOptions(argv)

  t.assert(options.height === argv.height, 'sets height')
  t.assert(options.width === argv.width, 'sets width')
  t.assert(options.quality === argv.quality, 'sets quality')
  t.assert(options.format === argv.outputFormat, 'sets outputFormat as format')
})

test('filterBadCrops should return false on nulls and bad scores', function (t) {
  t.plan(4)
  t.assert(crop.filterBadCrops(null) === false, 'filters nulls')
  t.assert(!crop.filterBadCrops({score: -0.1}), 'filters very negatively scored values')
  t.assert(crop.filterBadCrops({score: -0.00001}), 'does not filter minorly negative values')
  t.assert(crop.filterBadCrops({score: 1}), 'does not filter positive values')
})

test('fanCrops should spread an array into a stream of specifications', function (t) {
  t.plan(1)
  let example = {
    input: 'in',
    output: 'out',
    list: [ ]
  }

  let every = true

  example.list.push(null)

  for (let i = 0; i < 10000; i++) {
    example.list.push(generateFakeCrop())
  }

  let i = 1

  pull(
    pull.values([example]),
    crop.fanCrops(),
    pull.map(function (ea) {
      every = every &&
        (ea.width === example.list[i].width) &&
        (ea.height === example.list[i].height) &&
        (ea.x === example.list[i].x) &&
        (ea.y === example.list[i].y) &&
        (ea.score === example.list[i].score.total)
      i += 1
    }),
    pull.drain()
  )

  t.assert(every, 'every element in the crop list is transformed into a specification')
})
