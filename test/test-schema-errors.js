'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('schema-errors', function() {
  var registry = new Registry();


  test('Invalid schema id', function() {
    var err = registry.addSchema({
      a: 1
    });
    assert(err);
    assert.strictEqual('Invalid schema id', err.message);
  });


  test('Invalid type definition #1', function() {
    var err = registry.addSchema({
      id: 'xxx',
      a: 1
    });
    assert(err);
    assert.strictEqual('Invalid type definition', err.message);
  });


  test('Invalid type definition #2', function() {
    var err = registry.addSchema({
      type: 'garbage',
      id: 'xxx',
      a: 1
    });
    assert(err);
    assert.strictEqual('Invalid type definition', err.message);
  });


  test('Invalid type definition #3', function() {
    var err = registry.addSchema({
      type: 'unknown',
      id: 'xxx'
    });
    assert(err);
    assert.strictEqual('Invalid type definition', err.message);
  });


  test('Unknown reference schema "unknown"', function() {
    var err = registry.addSchema({
      id: 'xxx',
      type: 'object',
      properties: {
        a: '$id:unknown'
      }
    });
    assert(err);
    assert.strictEqual('Unknown reference schema "unknown"', err.message);
  });


  test('Invalid properties definition', function() {
    var err = registry.addSchema({
      id: 'xxx',
      type: 'object',
      properties: []
    });
    assert(err);
    assert.strictEqual('Invalid properties definition', err.message);
  });


  test('Invalid schema definition', function() {
    var err = registry.addSchema({
      id: 'xxx',
      type: 'object',
      properties: {
        xxx: []
      }
    });
    assert(err);
    assert.strictEqual('Invalid schema definition', err.message);
  });


  test('Mixed values in enum definition', function() {
    var err = registry.addSchema({
      id: 'xxx',
      type: 'string',
      enum: ['abc', 1, 2]
    });
    assert(err);
    assert.strictEqual('Mixed values in enum definition', err.message);
  });


  test('Non-primitive values in enum definition', function() {
    var err = registry.addSchema({
      id: 'xxx',
      type: 'string',
      enum: [{}, 'abc', 2]
    });
    assert(err);
    assert.strictEqual('Non-primitive values in enum definition', err.message);
  });


  test('Invalid enum definition', function() {
    var err = registry.addSchema({
      id: 'xxx',
      type: 'string',
      enum: true
    });
    assert(err);
    assert.strictEqual('Invalid enum definition', err.message);
  });


  test('Invalid enum definition # type = mixed', function() {
    var err = registry.addSchema({
      id: 'xxx',
      type: 'mixed',
      enum: 'xxx'
    });
    assert(err);
    assert.strictEqual('Invalid enum definition', err.message);
  });


  test('Unknown schema "unknown"', function() {
    var err = registry.removeSchema('unknown');
    assert(err);
    assert.strictEqual('Unknown schema "unknown"', err.message);
  });
});
