'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('function', function() {
  var registry = new Registry();

  test('properties', function() {
    var err = registry.addSchema({
      id: 'IAmFunction',
      type: 'function',
      properties: {
        mini: {
          type: 'boolean'
        },
        name: 'you'
      }
    });
    assert.strictEqual(undefined, err);

    function me() { /* empty */ }
    me.mini = true;

    err = registry.test('IAmFunction', me);

    assert(err);
    assert(err.validation);
    assert.deepEqual([[
      'name',
      'string',
      'value',
      'me'
    ]], err.validation);
  });


  test('min/max', function() {
    var err = registry.addSchema({
      id: 'IAmFunction',
      type: 'function',
      min: 1,
      max: 2
    });
    assert(err === undefined);

    /*eslint-disable no-unused-vars */
    function me(a, b) { /* empty */ }
    /*eslint-enable no-unused-vars */

    err = registry.test('IAmFunction', me);
    assert.strictEqual(undefined, err);
  });


  test('min', function() {
    var err = registry.addSchema({
      id: 'IAmFunction',
      type: 'function',
      min: 1
    });
    assert.strictEqual(undefined, err);

    function me() { /* empty */ }

    err = registry.test('IAmFunction', me);
    assert(err);
    assert.deepEqual([[null, 'function', 'min', 0]], err.validation);
  });


  test('max', function() {
    var err = registry.addSchema({
      id: 'IAmFunction',
      type: 'function',
      max: 0
    });
    assert.strictEqual(undefined, err);

    /*eslint-disable no-unused-vars */
    function me(a) { /* empty */ }
    /*eslint-enable no-unused-vars */

    err = registry.test('IAmFunction', me);
    assert(err);
    assert.deepEqual([[null, 'function', 'max', 1]], err.validation);
  });
});
