'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('array', function() {
  var registry;

  setup(function() {
    registry = new Registry();
  });


  test('min/max', function() {
    registry.addSchema({
      id: 'meArray',
      type: 'array',
      min: 1,
      max: 2
    });

    var errors = registry.test('meArray', [1, 2]);
    assert(!errors);
  });


  test('min', function() {
    registry.addSchema({
      id: 'meArray',
      type: 'array',
      min: 2
    });

    var errors = registry.test('meArray', [1]);

    assert.deepEqual(errors, [[
      null,
      'array',
      'min',
      1
    ]]);
  });


  test('max', function() {
    registry.addSchema({
      id: 'meArray',
      type: 'array',
      max: 2
    });

    var errors = registry.test('meArray', [1, 2, 3]);

    assert.deepEqual(errors, [[
      null,
      'array',
      'max',
      3
    ]]);
  });


  test('enum', function() {
    registry.addSchema({
      id: 'meArray',
      type: 'array',
      enum: [1, 2, 3]
    });

    var errors = registry.test('meArray', [3, 1, 2]);
    assert(!errors);
  });


  test('enum/ordered', function() {
    registry.addSchema({
      id: 'meArray',
      type: 'array',
      enum: [1, 2, 3],
      ordered: true
    });

    registry.test('meArray', [1, 2, 3]);

    var errors = registry.test('meArray', [3, 1, '2']);

    assert.deepEqual(errors, [
      ['0', 'integer', 'value', 3],
      ['1', 'integer', 'value', 1],
      ['2', 'integer', 'type', '2']
    ]);

    errors = registry.test('meArray', [3, 2, 1]);

    assert.deepEqual(errors, [
      ['0', 'integer', 'value', 3],
      ['2', 'integer', 'value', 1]
    ]);
  });


  test('allowNullValue', function() {
    registry.addSchema({
      id: 'meArray',
      type: 'array',
      min: 2,
      allowNullValue: true
    });

    var errors = registry.test('meArray', null);
    assert(!errors);


    registry.addSchema({
      id: 'me2Array',
      type: 'array',
      min: 2
    });

    errors = registry.test('me2Array', null);
    assert.deepEqual(errors, [
      [null, 'array', 'type', null]
    ]);
  });
});
