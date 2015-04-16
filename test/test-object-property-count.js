'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('object-property-count', function() {
  var registry = new Registry();

  test('minimum count', function() {
    var err, schema = 'minobject';

    registry.addSchema({
      id: schema,
      type: 'object',
      allowUnknownProperties: true,
      min: 2
    });

    err = registry.test(schema, {
      test: 1,
      test2: 1
    });
    assert.strictEqual(undefined, err);

    err = registry.test(schema, {
      test: 1
    });
    assert(err.validation);
    assert.deepEqual([
      [null, 'object', 'min', 1]
    ], err.validation);
  });


  test('maximum count', function() {
    var err, schema = 'maxobject';

    registry.addSchema({
      id: schema,
      type: 'object',
      allowUnknownProperties: true,
      max: 2
    });

    err = registry.test(schema, {
      test: 1
    });
    assert.strictEqual(undefined, err);

    err = registry.test(schema, {
      test: 1,
      test2: 1
    });
    assert.strictEqual(undefined, err);

    err = registry.test(schema, {
      test: 1,
      test2: 1,
      test3: 'thats too much'
    });

    assert(err.validation);
    assert.deepEqual([
      [null, 'object', 'max', 3]
    ], err.validation);
  });
});
