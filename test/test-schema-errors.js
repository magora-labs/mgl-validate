'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('schema-errors', function() {
  var registry = new Registry();


  test('Invalid type definition #1', function() {
    assert.throws(function() {
      registry.addSchema({id: 'xxx', a: 1});
    }, function(err) {
      assert.strictEqual('Invalid type definition', err.message);
      return true;
    });
  });


  test('Invalid type definition #2', function() {
    assert.throws(function() {
      registry.addSchema({
        type: 'garbage',
        id: 'xxx',
        a: 1
      });
    }, function(err) {
      assert.strictEqual('Invalid type definition', err.message);
      return true;
    });
  });


  test('Invalid type definition #3', function() {
    assert.throws(function() {
      registry.addSchema({
        type: 'unknown',
        id: 'xxx'
      });
    }, function(err) {
      assert.strictEqual('Invalid type definition', err.message);
      return true;
    });
  });


  test('Unknown reference schema "unknown"', function() {
    assert.throws(function() {
      registry.addSchema({
        id: 'xxx',
        type: 'object',
        properties: {
          a: '$id:unknown'
        }
      });
    }, function(err) {
      assert.strictEqual('Unknown reference schema "unknown"', err.message);
      return true;
    });
  });


  test('Invalid properties definition', function() {
    assert.throws(function() {
      registry.addSchema({
        id: 'xxx',
        type: 'object',
        properties: []
      });
    }, function(err) {
      assert.strictEqual('Invalid properties definition', err.message);
      return true;
    });
  });


  test('Invalid schema definition', function() {
    assert.throws(function() {
      registry.addSchema({
        id: 'xxx',
        type: 'object',
        properties: {
          xxx: []
        }
      });
    }, function(err) {
      assert.strictEqual('Invalid schema definition', err.message);
      return true;
    });
  });


  test('Invalid enum element type', function() {
    assert.throws(function() {
      registry.addSchema({
        id: 'xxx',
        type: 'string',
        enum: ['abc', 1, 2]
      });
    }, function(err) {
      assert.strictEqual('Invalid enum element type', err.message);
      return true;
    });
  });


  test('Invalid enum definition', function() {
    assert.throws(function() {
      registry.addSchema({
        id: 'xxx',
        type: 'string',
        enum: true
      });
    }, function(err) {
      assert.strictEqual('Invalid enum definition', err.message);
      return true;
    });
  });


  test('Invalid enum definition # type = mixed', function() {
    assert.throws(function() {
      registry.addSchema({
        id: 'xxx',
        type: 'mixed',
        enum: 'xxx'
      });
    }, function(err) {
      assert.strictEqual('Invalid enum definition', err.message);
      return true;
    });
  });


  test('Unknown schema "unknown"', function() {
    assert.throws(function() {
      registry.removeSchema('unknown');
    }, function(err) {
      assert.strictEqual('Unknown schema "unknown"', err.message);
      return true;
    });
  });


  test('Invalid enum element type #1', function() {
    assert.throws(function() {
      registry.addSchema({
        id: 'erroneous',
        type: 'string',
        enum: ['a', 2]
      });
    }, function(err) {
      assert.strictEqual('Invalid enum element type', err.message);
      return true;
    });
  });


  test('Invalid enum element type #2', function() {
    assert.throws(function() {
      registry.addSchema({
        id: 'erroneous',
        type: 'string',
        enum: [2]
      });
    }, function(err) {
      assert.strictEqual('Invalid enum element type', err.message);
      return true;
    });
  });


  test('Invalid enum definition', function() {
    assert.throws(function() {
      registry.addSchema({
        id: 'erroneous',
        type: 'array',
        enum: 1
      });
    }, function(err) {
      assert.strictEqual('Invalid enum definition', err.message);
      return true;
    });
  });


  test('Invalid schema id', function() {
    assert.throws(function() {
      registry.addSchema({
        id: 2,
        type: 'array'
      });
    }, function(err) {
      assert.strictEqual('Invalid schema id', err.message);
      return true;
    });
  });


  test('Missing schema id', function() {
    assert.throws(function() {
      registry.addSchema({
        type: 'array'
      });
    }, function(err) {
      assert.strictEqual('Missing schema id', err.message);
      return true;
    });
  });
});
