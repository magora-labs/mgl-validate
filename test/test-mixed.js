'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('mixed', function() {
  var registry = new Registry();

  test('mixed', function() {
    var err = registry.addSchema({
      id: 'uuid',
      type: 'string',
      pattern: '[a-f\\d]{8}(-[a-f\\d]{4}){3}-[a-f\\d]{12}'
    });
    assert.strictEqual(undefined, err);

    err = registry.addSchema({
      id: 'mixed',
      type: 'mixed',
      enum: [
        {
          type: 'function',
          min: 2,
          max: 2
        },
        '$id:uuid',
        {
          type: 'object',
          properties: {
            whateva: {
              type: 'mixed',
              enum: ['$id:uuid', {
                type: 'number'
              }]
            }
          }
        }
      ]
    });
    assert.strictEqual(undefined, err);

    /*eslint-disable no-unused-vars */
    err = registry.test('mixed', function(a, b) { /* empty */ });
    /*eslint-enable no-unused-vars */

    assert.strictEqual(undefined, err);

    err = registry.test('mixed', 'c71960cc-d90c-4ac9-91f2-abb0f29543ac');
    assert.strictEqual(undefined, err);

    err = registry.test('mixed', 'xxx');
    assert(err);
    assert.deepEqual([
      ['*', 'function', 'type', 'xxx'],
      ['*', 'string', 'pattern', 'xxx'],
      ['*', 'object', 'type', 'xxx']
    ], err.validation);

    err = registry.test('mixed', {
      whateva: 'c71960cc-d90c-4ac9-91f2-abb0f29543ac'
    });
    assert.strictEqual(undefined, err);
  });
});
