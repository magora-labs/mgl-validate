'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('schema-errors-unknown-type', function() {
  var registry;

  setup(function() {
    registry = new Registry();
  });


  test('Unknow type', function() {
    var unknownType = 'thisTypeIsVeryVeryUnknown';
    var err = registry.addSchema({
      id: 'xxx',
      type: unknownType,
      properties: []
    });
    assert(err);
    assert.strictEqual('Unknown type \'' + unknownType + '\'', err.message);
  });

});
