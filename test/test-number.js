'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('number', function() {
  var registry;

  setup(function() {
    registry = new Registry();
  });


  test('value 0', function() {
    var err = registry.addSchema({
      id: 'meNumber',
      type: 'object',
      properties: {
        n: 0
      }
    });
    assert.strictEqual(undefined, err);

    err = registry.test('meNumber', {n: 1});
    assert.deepEqual([['n', 'integer', 'value', 1]], err.validation);
  });


  test('value 1', function() {
    var err = registry.addSchema({
      id: 'meNumber',
      type: 'object',
      properties: {
        n: 1
      }
    });
    assert.strictEqual(undefined, err);

    err = registry.test('meNumber', {n: 0});
    assert.deepEqual([['n', 'integer', 'value', 0]], err.validation);
  });


  test('value -1', function() {
    var err = registry.addSchema({
      id: 'meNumber',
      type: 'object',
      properties: {
        n: -1
      }
    });
    assert.strictEqual(undefined, err);

    err = registry.test('meNumber', {n: 0});
    assert.deepEqual([['n', 'integer', 'value', 0]], err.validation);
  });
});
