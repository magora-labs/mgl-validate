'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('string', function() {
  var registry;

  setup(function() {
    registry = new Registry();
  });


  test('min/max', function() {
    registry.addSchema({
      id: 'meString',
      type: 'string',
      min: 1,
      max: 2
    });

    var errors = registry.test('meString', '1');
    assert(!errors);
  });


  test('min', function() {
    registry.addSchema({
      id: 'meString',
      type: 'string',
      min: 1
    });

    var errors = registry.test('meString', '');
    assert.deepEqual(errors, [[null, 'string', 'min', 0]]);
  });


  test('max', function() {
    registry.addSchema({
      id: 'meString',
      type: 'string',
      max: 0
    });

    var errors = registry.test('meString', '1');
    assert.deepEqual(errors, [[null, 'string', 'max', 1]]);
  });


  test('enum ok', function() {
    registry.addSchema({
      id: 'meString',
      type: 'string',
      enum: ['1', '2']
    });

    var errors = registry.test('meString', '1');
    assert(!errors);
  });


  test('enum err', function() {
    registry.addSchema({
      id: 'meString',
      type: 'string',
      enum: ['1', '2']
    });

    var errors = registry.test('meString', '3');
    assert.deepEqual(errors, [[null, 'string', 'value', '3']]);
  });


  test('enum (single element)', function() {
    registry.addSchema({
      id: 'meString',
      type: 'string',
      enum: ['1']
    });

    var errors = registry.test('meString', '3');
    assert.deepEqual(errors, [[null, 'string', 'value', '3']]);
  });
});
