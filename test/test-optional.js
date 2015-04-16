'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('optional', function() {
  test('string', function() {
    var registry = new Registry();

    var err = registry.addSchema({
      id: 'number-string',
      type: 'number',
      optional: true
    });
    assert.strictEqual(undefined, err);

    err = registry.test('number-string', 'abc');
    assert(err);
    assert.deepEqual([
      [null, 'number', 'type', 'abc']
    ], err.validation);
  });


  test('undefined', function() {
    var registry = new Registry();

    var err = registry.addSchema({
      id: 'string-undefined',
      type: 'string',
      optional: true
    });
    assert.strictEqual(undefined, err);

    err = registry.test('string-undefined', undefined);
    assert.strictEqual(undefined, err);
  });


  test('number', function() {
    var registry = new Registry();

    var err = registry.addSchema({
      id: 'number-number',
      type: 'number',
      optional: true
    });
    assert.strictEqual(undefined, err);

    err = registry.test('number-number', 123);
    assert.strictEqual(undefined, err);
  });


  test('!optional number', function() {
    var registry = new Registry();

    var err = registry.addSchema({
      id: 'number',
      type: 'number'
    });
    assert.strictEqual(undefined, err);

    err = registry.test('number', undefined);
    assert(err);
    assert.deepEqual([[null, 'number', 'type', undefined]], err.validation);
  });
});
