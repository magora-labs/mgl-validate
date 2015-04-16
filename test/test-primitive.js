'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('primitive', function() {
  var registry = new Registry();


  test('add "primitive" schema', function() {
    var err = registry.addSchema({
      id: 'primitive',
      type: 'object',
      properties: {
        flag: true,
        text: 'abc',
        v0id: null,
        uint: 123
      }
    });

    assert.strictEqual(undefined, err);
  });


  test('validate "primitive"', function() {
    var err = registry.test('primitive', {
      v0id: 1,
      flag: false,
      text: 'abc',
      uint: 123
    });

    assert(err);
    assert(err.validation);
    assert.deepEqual([
      ['flag', 'boolean', 'value', false],
      ['v0id', 'null', 'type', 1]
    ], err.validation);
  });


  test('remove "primitive" schema', function() {
    assert.deepEqual(registry.getSchemas(), ['primitive']);

    var err = registry.removeSchema('primitive');
    assert.strictEqual(undefined, err);

    assert.deepEqual([], registry.getSchemas());
  });
});
