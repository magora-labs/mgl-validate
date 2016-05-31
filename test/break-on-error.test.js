'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('breakOnError', function() {
  var registry;


  setup(function() {
    registry = new Registry({breakOnError: true});
  });


  test('mixed', function() {
    registry.addSchema({
      id: 'break-on-error:mixed',
      type: 'mixed',
      enum: [{type: 'string'}, {type: 'number'}]
    });

    var errors = registry.test('break-on-error:mixed', true);
    assert.deepEqual(errors, [['*', 'string', 'type', true]]);
  });


  test('array', function() {
    registry.addSchema({
      id: 'break-on-error:array',
      type: 'array',
      enum: [{type: 'string'}, {type: 'number'}]
    });

    var errors = registry.test('break-on-error:array', [true, false, 1]);
    assert.deepEqual(errors, [['0', 'string', 'type', true]]);
  });
});
