'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('mixed', function() {
  var registry = new Registry();

  test('enum', function() {
    registry.addSchema({
      id: 'mixed',
      type: 'mixed',
      enum: [
        {
          type: 'function',
          min: 2,
          max: 2
        },
        {
          id: 'uuid',
          type: 'string',
          pattern: '[a-f\\d]{8}(-[a-f\\d]{4}){3}-[a-f\\d]{12}'
        },
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

    /* eslint-disable no-unused-vars */
    var errors = registry.test('mixed', function(a, b) { /* empty */ });
    /* eslint-enable no-unused-vars */
    assert(!errors);

    errors = registry.test('mixed', 'c71960cc-d90c-4ac9-91f2-abb0f29543ac');
    assert(!errors);

    errors = registry.test('mixed', 'xxx');
    assert.deepEqual(errors, [
      ['*', 'function', 'type', 'xxx'],
      ['*', 'string', 'pattern', 'xxx'],
      ['*', 'object', 'type', 'xxx']
    ]);

    errors = registry.test('mixed', {
      whateva: 'c71960cc-d90c-4ac9-91f2-abb0f29543ac'
    });
    assert(!errors);
  });
});
