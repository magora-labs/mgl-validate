'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('dictionary', function() {
  var registry;


  setup(function() {
    registry = new Registry();
  });


  test('render', function() {
    var schema = registry.addSchema({
      id: 'options',
      type: 'object',
      describe: 'Virtual device configuration',
      properties: {
        access: {
          type: 'object',
          describe: 'foreign device access, see `device._access()`',
          properties: {
            '*': {
              type: 'array',
              min: 1,
              enum: {type: 'string'}
            }
          },
          optional: true
        },
        observe: {
          type: 'array',
          enum: {
            type: 'array',
            min: 3,
            max: 4,
            ordered: true,
            enum: [
              {type: 'string', describe: 'The device name'},
              {type: 'string', describe: 'The device state', enum: ['UNDEF', 'CHANGED', 'DEF']},
              {type: 'string', describe: 'The internal command to generate'},
              {type: 'array', describe: 'Device type filters', enum: {type: 'string'}}
            ]
          },
          optional: true
        },
        states: {
          type: 'array',
          enum: {type: 'string'},
          min: 1
        },
        commands: {
          type: 'object',
          properties: {
            '*': {
              type: 'function',
              length: 1
            }
          }
        }
      }
    });

    Registry.dictionary(schema, 'options');
  });
});
