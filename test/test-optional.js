'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('optional', function() {


  test('string', function() {
    var registry = new Registry();

    registry.addSchema({
      id: 'number-string',
      type: 'number',
      optional: true
    });

    var errors = registry.test('number-string', 'abc');
    assert.deepEqual(errors, [[
      null,
      'number',
      'type',
      'abc'
    ]]);
  });


  test('undefined', function() {
    var registry = new Registry();

    registry.addSchema({
      id: 'string-undefined',
      type: 'string',
      optional: true
    });

    var errors = registry.test('string-undefined', undefined);
    assert(!errors);
  });


  test('number', function() {
    var registry = new Registry();

    registry.addSchema({
      id: 'number-number',
      type: 'number',
      optional: true
    });

    var errors = registry.test('number-number', 123);
    assert(!errors);
  });


  test('!optional number', function() {
    var registry = new Registry();

    registry.addSchema({
      id: 'number',
      type: 'number'
    });

    var errors = registry.test('number', undefined);
    assert.deepEqual(errors, [[
      null,
      'number',
      'type',
      undefined
    ]]);
  });
});
