'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('function', function() {
  var registry = new Registry();

  test('properties', function() {
    registry.addSchema({
      id: 'IAmFunction',
      type: 'function',
      properties: {
        mini: {
          type: 'boolean'
        },
        name: 'you'
      }
    });

    function me() { /* empty */ }
    me.mini = true;

    var errors = registry.test('IAmFunction', me);
    assert.deepEqual(errors, [[
      'name',
      'string',
      'value',
      'me'
    ]]);
  });


  test('min/max', function() {
    registry.addSchema({
      id: 'IAmFunction',
      type: 'function',
      min: 1,
      max: 2
    });

    /* eslint-disable no-unused-vars */
    function me(a, b) { /* empty */ }
    /* eslint-enable no-unused-vars */

    var errors = registry.test('IAmFunction', me);
    assert(!errors);
  });


  test('min', function() {
    registry.addSchema({
      id: 'IAmFunction',
      type: 'function',
      min: 1
    });

    function me() { /* empty */ }

    var errors = registry.test('IAmFunction', me);
    assert.deepEqual(errors, [[
      null,
      'function',
      'min',
      0
    ]]);
  });


  test('max', function() {
    registry.addSchema({
      id: 'IAmFunction',
      type: 'function',
      max: 0
    });

    /* eslint-disable no-unused-vars */
    function me(a) { /* empty */ }
    /* eslint-enable no-unused-vars */

    var errors = registry.test('IAmFunction', me);
    assert.deepEqual(errors, [[
      null,
      'function',
      'max',
      1
    ]]);
  });
});
