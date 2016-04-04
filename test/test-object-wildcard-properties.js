'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('object-wildcard-properties', function() {
  var registry = new Registry();

  test('add "wildcard" schema', function() {
    registry.addSchema({
      id: 'wildcard',
      type: 'object',
      properties: {
        '*': {
          type: 'string'
        },
        key: {
          type: 'number',
          min: 0
        },
        notAWildcard: {
          type: 'number',
          enum: [1, 2, 3]
        }
      }
    });
  });


  test('validate "wildcard"', function() {
    var errors = registry.test('wildcard', {
      someKey: 'OK',
      someOtherKey: -1,
      key: -34,
      notAWildcard: 10
    });

    assert.deepEqual(errors, [
      ['someOtherKey', 'string', 'type', -1],
      ['key', 'number', 'min', -34],
      ['notAWildcard', 'number', 'value', 10]
    ]);
  });
});
