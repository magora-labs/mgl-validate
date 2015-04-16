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
    var err = registry.addSchema({
      id: 'meArray',
      type: 'array',
      min: 1,
      max: 2
    });
    assert.strictEqual(undefined, err);

    err = registry.test('meArray', [1, 2]);
    assert.strictEqual(undefined, err);
  });


  test('min', function() {
    var err = registry.addSchema({
      id: 'meArray',
      type: 'array',
      min: 2
    });
    assert.strictEqual(undefined, err);

    err = registry.test('meArray', [1]);
    assert(err);
    assert.deepEqual([[null, 'array', 'min', 1]], err.validation);
  });


  test('max', function() {
    var err = registry.addSchema({
      id: 'meArray',
      type: 'array',
      max: 2
    });
    assert.strictEqual(undefined, err);


    err = registry.test('meArray', [1, 2, 3]);
    assert(err);
    assert.deepEqual([[null, 'array', 'max', 3]], err.validation);
  });
});
