'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('object-wildcard-properties', function() {
  var registry = new Registry();

  test('add "wildcard" schema', function() {
    var err = registry.addSchema({
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
    assert.strictEqual(undefined, err);
  });


  test('validate "wildcard"', function() {
    var err = registry.test('wildcard', {
      someKey: 'OK',
      someOtherKey: -1,
      key: -34,
      notAWildcard: 10
    });

    assert(err);
    assert(err.validation);
    assert.deepEqual([
      ['someOtherKey', 'string', 'type', -1],
      ['key', 'number', 'min', -34],
      ['notAWildcard', 'number', 'enum', 10]
    ], err.validation);
  });
});
