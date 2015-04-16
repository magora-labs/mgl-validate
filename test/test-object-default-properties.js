'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('object-default-properties', function() {
  var registry = new Registry();

  test('defaults', function() {
    var err = registry.addSchema({
      id: 'restful_acns',
      type: 'object',
      properties: {
        visibilityTimeout: {
          type: 'number',
          min: 0,
          max: 43200,
          default: 30
        },
        maximumMessageSize: {
          type: 'number',
          min: 1024,
          max: 65536,
          default: 65536
        },
        messageRetentionPeriod: {
          type: 'number',
          min: 60,
          max: 1209600,
          default: 345600
        },
        delay: {
          type: 'number',
          min: 0,
          max: 900,
          default: 0
        }
      }
    });

    assert.strictEqual(undefined, err);

    var data = {};

    err = registry.test('restful_acns', data);
    assert.strictEqual(undefined, err);
    assert.strictEqual(30, data.visibilityTimeout);
    assert.strictEqual(65536, data.maximumMessageSize);
    assert.strictEqual(345600, data.messageRetentionPeriod);
    assert.strictEqual(0, data.delay);
  });
});
