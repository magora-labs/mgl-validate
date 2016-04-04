'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('primitive', function() {
  var registry = new Registry();


  test('add "primitive" schema', function() {
    registry.addSchema({
      id: 'primitive',
      type: 'object',
      properties: {
        flag: true,
        text: 'abc',
        v0id: null,
        uint: 123
      }
    });
  });


  test('validate "primitive"', function() {
    var errors = registry.test('primitive', {
      v0id: 1,
      flag: false,
      text: 'abc',
      uint: 123
    });

    assert.deepEqual(errors, [
      ['flag', 'boolean', 'value', false],
      ['v0id', 'null', 'type', 1]
    ]);
  });


  test('remove "primitive" schema', function() {
    assert.deepEqual(registry.getSchemas(), ['primitive']);
    registry.removeSchema('primitive');
    assert.deepEqual([], registry.getSchemas());
  });
});
