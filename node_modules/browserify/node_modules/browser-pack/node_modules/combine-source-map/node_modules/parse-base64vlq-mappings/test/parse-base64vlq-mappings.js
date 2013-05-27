'use strict';
/*jshint asi: true */

var test = require('trap').test
  , parse = require('..')
  , Generator = require('source-map').SourceMapGenerator


test('parsing generated one to one mappings', function (t) {
  var gen = new Generator({ file: 'foo.js' })
  var add = [ 
    { generated: { line: 1, column: 0 },
      original: { line: 1, column: 0 },
      source: 'foo.js',
      name: null },
    { generated: { line: 2, column: 0 },
      original: { line: 2, column: 0 },
      source: 'foo.js',
      name: null },
    { generated: { line: 3, column: 0 },
      original: { line: 3, column: 0 },
      source: 'foo.js',
      name: null },
    { generated: { line: 4, column: 0 },
      original: { line: 4, column: 0 },
      source: 'foo.js',
      name: null },
    { generated: { line: 5, column: 0 },
      original: { line: 5, column: 0 },
      source: 'foo.js',
      name: null } ]    

  add.forEach(gen.addMapping.bind(gen))
  var addedMappings = add.map(function (m) { return { generated: m.generated, original: m.original } })

  var mappings = gen.toJSON().mappings
    , parsed = parse(mappings)

  t.deepEqual(parsed, addedMappings, 'parses out added mappings')
});

test('parsing generated offset mappings', function (t) {
  var gen = new Generator({ file: 'foo.js' })
  var add = [ 
      { generated: { line: 21, column: 0 },
        original: { line: 1, column: 0 },
        source: 'foo.js',
        name: null },
      { generated: { line: 22, column: 3 },
        original: { line: 2, column: 0 },
        source: 'foo.js',
        name: null },
      { generated: { line: 23, column: 0 },
        original: { line: 3, column: 2 },
        source: 'foo.js',
        name: null },
      { generated: { line: 24, column: 0 },
        original: { line: 4, column: 5 },
        source: 'foo.js',
        name: null }]

  add.forEach(gen.addMapping.bind(gen))
  var addedMappings = add.map(function (m) { return { generated: m.generated, original: m.original } })

  var mappings = gen.toJSON().mappings
    , parsed = parse(mappings)

  t.deepEqual(parsed, addedMappings, 'parses out added mappings')
});

