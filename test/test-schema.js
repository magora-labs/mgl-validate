'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var validate = require('../');


suite('schema', function() {
  var registry = validate();


  test('add "uuid" schema', function() {
    var err = registry.addSchema({
      id: 'uuid',
      type: 'string',
      pattern: '[a-f\\d]{8}(-[a-f\\d]{4}){3}-[a-f\\d]{12}'
    });

    assert.strictEqual(undefined, err);

    registry.schemas.uuid.typeOf(new Buffer(1));
  });


  test('validate "uuid"', function() {
    var err = registry.test('uuid', 'c71960cc-d90c-4ac9-91f2-abb0f29543ac');
    assert.strictEqual(undefined, err);

    err = registry.test('uuid', 'c71960cc-d90c-4ac991f2-abb0f29543ac');
    assert(err);
    assert(err.validation);
    assert.deepEqual(err.validation, [[
      null,
      'string',
      'pattern',
      'c71960cc-d90c-4ac991f2-abb0f29543ac'
    ]]);
  });


  test('remove "uuid" schema', function() {
    assert.deepEqual(['uuid'], registry.getSchemas());

    var err = registry.removeSchema('uuid');
    assert.strictEqual(undefined, err);

    assert.deepEqual([], registry.getSchemas());
  });


  test('add "uuid" schema, again', function() {
    var err = registry.addSchema({
      id: 'uuid',
      type: 'string',
      pattern: '[a-f\\d]{8}(-[a-f\\d]{4}){3}-[a-f\\d]{12}'
    });

    assert.strictEqual(undefined, err);
  });


  test('add "document" schema', function() {
    var err = registry.addSchema({
      id: 'document',
      type: 'object',
      allowUnknownProperties: true,
      properties: {
        id: '$id:uuid',
        hello: 'world',
        idiots: {
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
    assert.strictEqual(undefined, err);
    assert.strictEqual(
        registry.schemas.document.properties.id, registry.schemas.uuid);
  });


  test('add "stream" schema', function() {
    var err = registry.addSchema({
      id: 'stream',
      type: 'array',
      min: 1,
      max: 100,
      enum: '$id:document'
    });
    assert.strictEqual(undefined, err);


    assert.deepEqual([
      'uuid',
      'document',
      'stream'
    ], registry.getSchemas());
  });


  test('validate unknown schema', function() {
    var err = registry.test('unknown', {});

    assert(err);
    assert.strictEqual('Unknown schema "unknown"', err.message);
  });


  test('validate "stream"', function() {
    var err = registry.test('stream', [{
      id: 'c71960cc-d90c-4ac9-91f2-abb0f29543ac',
      hello: 'world',
      test: 'wtf?!',
      idiots: 30,
      cars: 2.5,
      flag: 1,
      list: ['a', 'b'],
      list2: [1, 2, 3]
    }, {
      id: 'c71960cc-d90c4ac9-91f2-abb0f29543ac',
      hello: 'word',
      test: 1,
      idiots: 2,
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

    assert(err);
    assert(err.validation);

    assert.deepEqual([
      ['0.idiots', 'number', 'max', 30],
      ['0.cars', 'integer', 'type', 2.5],
      ['0.flag', 'boolean', 'type', 1],
      ['0', 'object', 'undefined', 'obj'],
      ['1.id', 'string', 'pattern', 'c71960cc-d90c4ac9-91f2-abb0f29543ac'],
      ['1.hello', 'string', 'value', 'word'],
      ['1.test', 'string', 'type', 1],
      ['1.list', 'array', 'enum', 'd'],
      ['1.list2.1', 'number', 'type', 'c'],
      ['1', 'object', 'undefined', 'obj'],
      ['2', 'object', 'undefined', 'hello'],
      ['2', 'object', 'undefined', 'idiots'],
      ['2', 'object', 'undefined', 'cars'],
      ['2', 'object', 'undefined', 'flag'],
      ['2', 'object', 'undefined', 'list']
    ], err.validation);
  });


  test('validate "stream" w/ breakOnError', function() {
    registry.breakOnError = true;

    var err = registry.test('stream', [{
      id: 'c71960cc-d90c-4ac9-91f2-abb0f29543ac',
      hello: 'world',
      test: 'wtf?!',
      idiots: 30,
      flag: 1,
      list: ['a', 'b']
    }, {
      id: 'c71960cc-d90c4ac9-91f2-abb0f29543ac',
      hello: 'word',
      test: 1,
      idiots: 2,
      flag: true,
      list: ['d']
    }]);

    registry.breakOnError = false;

    assert(err);
    assert(err.validation);
    assert.deepEqual([
      ['0.idiots', 'number', 'max', 30],
      ['0', 'object', 'undefined', 'cars'],
      ['0', 'object', 'undefined', 'list2'],
      ['0', 'object', 'undefined', 'obj']
    ], err.validation);
  });


  test('add "kitkat" schema', function() {
    var err = registry.addSchema({
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

    assert.strictEqual(undefined, err);
  });


  test('validate "kitkat"', function() {
    var err = registry.test('kitkat', {
      someKey: 'OK',
      someOtherKey: -1,
      key: -34,
      notAWildcard: 10
    });

    assert(err);
    assert(err.validation);
    assert.deepEqual([
      [null, 'object', 'unknown', 'someKey'],
      [null, 'object', 'unknown', 'someOtherKey'],
      ['key', 'number', 'min', -34],
      ['notAWildcard', 'number', 'enum', 10]
    ], err.validation);
  });
});
