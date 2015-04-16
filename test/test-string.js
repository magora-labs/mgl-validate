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
    var err = registry.addSchema({
      id: 'meString',
      type: 'string',
      min: 1,
      max: 2
    });
    assert.strictEqual(undefined, err);

    err = registry.test('meString', '1');
    assert.strictEqual(undefined, err);
  });


  test('min', function() {
    var err = registry.addSchema({
      id: 'meString',
      type: 'string',
      min: 1
    });
    assert.strictEqual(undefined, err);

    err = registry.test('meString', '');
    assert(err);
    assert.deepEqual([[null, 'string', 'min', 0]], err.validation);
  });


  test('max', function() {
    var err = registry.addSchema({
      id: 'meString',
      type: 'string',
      max: 0
    });
    assert.strictEqual(undefined, err);

    err = registry.test('meString', '1');
    assert(err);
    assert.deepEqual([[null, 'string', 'max', 1]], err.validation);
  });


  test('enum ok', function() {
    var err = registry.addSchema({
      id: 'meString',
      type: 'string',
      enum: ['1', '2']
    });
    assert.strictEqual(undefined, err);

    err = registry.test('meString', '1');
    assert.strictEqual(undefined, err);
  });


  test('enum err', function() {
    var err = registry.addSchema({
      id: 'meString',
      type: 'string',
      enum: ['1', '2']
    });
    assert.strictEqual(undefined, err);

    err = registry.test('meString', '3');
    assert(err);
    assert.deepEqual([[null, 'string', 'enum', '3']], err.validation);
  });
});
