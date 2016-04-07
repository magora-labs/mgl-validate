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


  test('min/max', function() {
    var schema = registry.addSchema({
      id: 'options',
      type: 'object',
      properties: {
        access: {           // {Object} access
          type: 'object',
          properties: {
            '*': {          //   {Array<string>} *
              type: 'array',
              min: 1,
              enum: {
                type: 'string'
              }
            }
          },
          optional: true
        },
        observe: {
          type: 'array',
          enum: {           // {Array<Array<string, string, string(, Array<string>)>>}
            type: 'array',
            min: 3,
            max: 4,
            ordered: true,
            enum: [
              {type: 'string'},
              {type: 'string'},
              {type: 'string'},
              {type: 'array', enum: {type: 'string'}}
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

    var x = Registry.dictionary(schema);
    // console.log(JSON.stringify(x, null, 2));

    x.print();
  });
});
