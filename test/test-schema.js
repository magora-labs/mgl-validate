'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var validate = require('../');


suite('schema', function() {
  var registry = validate();


  test('add "uuid" schema', function() {
    registry.addSchema({
      id: 'uuid',
      type: 'string',
      pattern: '[a-f\\d]{8}(-[a-f\\d]{4}){3}-[a-f\\d]{12}'
    });

    registry.schemas.uuid.typeOf(new Buffer(1));
  });


  test('validate "uuid"', function() {
    registry.test('uuid', 'c71960cc-d90c-4ac9-91f2-abb0f29543ac');

    var errors = registry.test('uuid', 'c71960cc-d90c-4ac991f2-abb0f29543ac');
    assert.deepEqual(errors, [[
      null,
      'string',
      'pattern',
      'c71960cc-d90c-4ac991f2-abb0f29543ac'
    ]]);
  });


  test('remove "uuid" schema', function() {
    assert.deepEqual(['uuid'], registry.getSchemas());
    registry.removeSchema('uuid');
    assert.deepEqual([], registry.getSchemas());
  });


  test('add "uuid" schema, again', function() {
    registry.addSchema({
      id: 'uuid',
      type: 'string',
      pattern: '[a-f\\d]{8}(-[a-f\\d]{4}){3}-[a-f\\d]{12}'
    });
  });


  test('add "document" schema', function() {
    registry.addSchema({
      id: 'document',
      type: 'object',
      allowUnknownProperties: true,
      properties: {
        id: '$id:uuid',
        hello: 'world',
        things: {
          type: 'number',
          min: 0,
          max: 10
        },
        cars: {
          type: 'integer'
        },
        flag: {
          type: 'boolean'
        },
        test: {
          type: 'string',
          min: 3,
          max: 255,
          optional: true
        },
        list: {
          type: 'array',
          enum: ['a', 'b', 'c']
        },
        list2: {
          type: 'array',
          enum: {
            type: 'number'
          }
        },
        obj: {
          type: 'object'
        }
      }
    });

    assert.strictEqual(
        registry.schemas.document.properties.id, registry.schemas.uuid);
  });


  test('add "stream" schema', function() {
    registry.addSchema({
      id: 'stream',
      type: 'array',
      min: 1,
      max: 100,
      enum: '$id:document'
    });

    assert.deepEqual([
      'uuid',
      'document',
      'stream'
    ], registry.getSchemas());
  });


  test('validate unknown schema', function() {
    assert.throws(function() {
      registry.test('unknown', {});
    }, function(err) {
      assert.strictEqual('Unknown schema "unknown"', err.message);
      return true;
    });
  });


  test('validate "stream"', function() {
    var errors = registry.test('stream', [{
      id: 'c71960cc-d90c-4ac9-91f2-abb0f29543ac',
      hello: 'world',
      test: 'wtf?!',
      things: 30,
      cars: 2.5,
      flag: 1,
      list: ['a', 'b'],
      list2: [1, 2, 3]
    }, {
      id: 'c71960cc-d90c4ac9-91f2-abb0f29543ac',
      hello: 'word',
      test: 1,
      things: 2,
      cars: 43,
      flag: true,
      list: ['d'],
      list2: [1, 'c', 3]
    }, {
      id: 'c71960cc-d90c-4ac9-91f2-abb0f29543ac',
      wtf: 1,
      list2: [1, 2, 3],
      obj: {}
    }]);

    assert.deepEqual(errors, [
      ['0.things', 'number', 'max', 30],
      ['0.cars', 'integer', 'type', 2.5],
      ['0.flag', 'boolean', 'type', 1],
      ['0', 'object', 'undefined', 'obj'],
      ['1.id', 'string', 'pattern', 'c71960cc-d90c4ac9-91f2-abb0f29543ac'],
      ['1.hello', 'string', 'value', 'word'],
      ['1.test', 'string', 'type', 1],
      ['1.list.0', 'string', 'value', 'd'],
      ['1.list2.1', 'number', 'type', 'c'],
      ['1', 'object', 'undefined', 'obj'],
      ['2', 'object', 'undefined', 'hello'],
      ['2', 'object', 'undefined', 'things'],
      ['2', 'object', 'undefined', 'cars'],
      ['2', 'object', 'undefined', 'flag'],
      ['2', 'object', 'undefined', 'list']
    ]);
  });


  test('validate "stream" w/ breakOnError', function() {
    registry.breakOnError = true;

    var errors = registry.test('stream', [{
      id: 'c71960cc-d90c-4ac9-91f2-abb0f29543ac',
      hello: 'world',
      test: 'wtf?!',
      things: 30,
      flag: 1,
      list: ['a', 'b']
    }, {
      id: 'c71960cc-d90c4ac9-91f2-abb0f29543ac',
      hello: 'word',
      test: 1,
      things: 2,
      flag: true,
      list: ['d']
    }]);

    assert.deepEqual(errors, [
      ['0.things', 'number', 'max', 30],
      ['0', 'object', 'undefined', 'cars'],
      ['0', 'object', 'undefined', 'list2'],
      ['0', 'object', 'undefined', 'obj']
    ]);

    registry.breakOnError = false;
  });


  test('add "kitkat" schema', function() {
    registry.addSchema({
      id: 'kitkat',
      type: 'object',
      properties: {
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


  test('validate "kitkat"', function() {
    var errors = registry.test('kitkat', {
      someKey: 'OK',
      someOtherKey: -1,
      key: -34,
      notAWildcard: 10
    });

    assert.deepEqual(errors, [
      [null, 'object', 'unknown', 'someKey'],
      [null, 'object', 'unknown', 'someOtherKey'],
      ['key', 'number', 'min', -34],
      ['notAWildcard', 'number', 'value', 10]
    ]);
  });
});
