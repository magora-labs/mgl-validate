'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('object-property-count', function() {
  var registry = new Registry();

  test('minimum count', function() {
    var schema = 'minobject';

    registry.addSchema({
      id: schema,
      type: 'object',
      allowUnknownProperties: true,
      min: 2
    });

    var errors = registry.test(schema, {
      test: 1,
      test2: 1
    });
    assert(!errors);

    errors = registry.test(schema, {test: 1});
    assert.deepEqual(errors, [[
      null,
      'object',
      'min',
      1
    ]]);
  });


  test('maximum count', function() {
    var schema = 'maxobject';

    registry.addSchema({
      id: schema,
      type: 'object',
      allowUnknownProperties: true,
      max: 2
    });

    var errors = registry.test(schema, {
      test: 1
    });
    assert(!errors);

    errors = registry.test(schema, {
      test: 1,
      test2: 1
    });
    assert(!errors);

    errors = registry.test(schema, {
      test: 1,
      test2: 1,
      test3: 'thats too much'
    });
    assert.deepEqual(errors, [[
      null,
      'object',
      'max',
      3
    ]]);
  });
});
