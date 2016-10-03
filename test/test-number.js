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
    registry.addSchema({
      id: 'meNumber',
      type: 'object',
      properties: {
        n: 0
      }
    });

    var errors = registry.test('meNumber', {n: 1});
    assert.deepEqual(errors, [[
      'n',
      'integer',
      'value',
      1
    ]]);
  });


  test('value 1', function() {
    registry.addSchema({
      id: 'meNumber',
      type: 'object',
      properties: {
        n: 1
      }
    });

    var errors = registry.test('meNumber', {n: 0});
    assert.deepEqual(errors, [[
      'n',
      'integer',
      'value',
      0
    ]]);
  });


  test('value -1', function() {
    registry.addSchema({
      id: 'meNumber',
      type: 'object',
      properties: {
        n: -1
      }
    });

    var errors = registry.test('meNumber', {n: 0});
    assert.deepEqual(errors, [[
      'n',
      'integer',
      'value',
      0
    ]]);
  });


  test('allowNullValue', function() {
    registry.addSchema({
      id: 'meNumber',
      type: 'object',
      properties: {
        n: 0
      },
      allowNullValue: true
    });

    var errors = registry.test('meNumber', null);
    assert(!errors);
  });
});
