'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var Registry = require('../');


suite('recursive', function() {


  test('string', function() {
    var registry = new Registry();

    registry.addSchema({
      id: 'virtual-condition',
      type: 'array',
      min: 2,
      max: 2,
      enum: {
        id: 'virtual-condition-set',
        type: 'mixed',
        enum: [
          {type: 'string'},
          {type: 'array', enum: '$id:virtual-condition-set'}
        ]
      }
    });

    var errors = registry.test('virtual-condition', [
      ['a', ['b', ['c', 'd']]], ['action']
    ]);
    assert(!errors);
  });


  test('ordered (limited)', function() {
    var registry = new Registry();

    registry.addSchema({
      id: 'virtual-condition',
      type: 'array',
      ordered: true,
      min: 2,
      max: 2,
      enum: [
        {
          id: 'virtual-condition-set',
          type: 'mixed',
          enum: [
            {type: 'string', min: 3},
            {type: 'array', enum: '$id:virtual-condition-set', min: 1}
          ]
        },
        {
          type: 'array',
          min: 1,
          enum: {
            type: 'string',
            min: 1
          }
        }
      ]
    });

    var errors = registry.test('virtual-condition', [
      ['abc', ['bcd', ['cde', 'def']]], ['action']
    ]);
    assert(!errors);

    errors = registry.test('virtual-condition', [
      ['abc', ['bcd', ['cde', 'def']]], ['action', ['action']]
    ]);
    assert.deepEqual(errors, [[
      '1.1',
      'string',
      'type',
      ['action']
    ]]);
  });


  test('ordered (periodic)', function() {
    var registry = new Registry();

    registry.addSchema({
      id: 'virtual-condition',
      type: 'array',
      ordered: true,
      enum: [
        {
          id: 'virtual-condition-set',
          type: 'mixed',
          enum: [
            {type: 'string', min: 3},
            {type: 'array', enum: '$id:virtual-condition-set', min: 1}
          ]
        },
        {
          type: 'array',
          min: 1,
          enum: {
            type: 'string',
            min: 1
          }
        }
      ]
    });

    var errors = registry.test('virtual-condition', [
      ['abc', ['bcd', ['cde', 'def']]], ['action']
    ]);
    assert(!errors);

    errors = registry.test('virtual-condition', [
      ['abc', ['bcd', ['cde', 'def']]], ['action'], ['xxx', ['xxx']]
    ]);
    assert(!errors);

    errors = registry.test('virtual-condition', [
      ['abc', ['bcd', ['cde', 'def']]], ['action'], ['xxx', ['xxx']], ['xxx', ['fails']]
    ]);

    assert.deepEqual(errors, [[
      '3.1',
      'string',
      'type',
      ['fails']
    ]]);
  });


  test('object tree', function() {
    var registry = new Registry();

    registry.addSchema({
      id: 'tree-node',
      type: 'object',
      properties: {
        name: {type: 'string', min: 1},
        children: {
          type: 'array',
          optional: true,
          enum: '$id:tree-node'
        }
      }
    });

    var errors = registry.test('tree-node', {
      name: 'a0',
      children: [{
        name: 'b0',
        children: [{
          name: 'c0',
          children: [{
            name: 'd0'
          }, {
            name: 'd1'
          }]
        }]
      }]
    });

    assert(!errors);
  });


  test('object tree (nesting limit)', function() {
    var registry = new Registry();

    registry.addSchema({
      id: 'tree-node',
      type: 'object',
      depth: 3,
      properties: {
        name: {type: 'string', min: 1},
        children: {
          type: 'array',
          optional: true,
          enum: '$id:tree-node'
        }
      }
    });

    var errors = registry.test('tree-node', {
      name: 'a0',
      children: [{
        name: 'b0',
        children: [{
          name: 'c0',
          children: [{
            name: 'd0'
          }, {
            name: 'd1'
          }]
        }]
      }]
    });

    assert.deepEqual(errors, [
      ['children.0.children.0', 'object', 'depth', {name: 'c0', children: [{
        name: 'd0'
      }, {
        name: 'd1'
      }]}]
    ]);
  });


  test('object tree (global nesting limit)', function() {
    var registry = new Registry({
      depth: 3
    });

    registry.addSchema({
      id: 'tree-node',
      type: 'object',
      properties: {
        name: {type: 'string', min: 1},
        children: {
          type: 'array',
          optional: true,
          enum: '$id:tree-node'
        }
      }
    });

    var errors = registry.test('tree-node', {
      name: 'a0',
      children: [{
        name: 'b0',
        children: [{
          name: 'c0',
          children: [{
            name: 'd0'
          }, {
            name: 'd1'
          }]
        }]
      }]
    });

    assert.deepEqual(errors, [
      ['children.0.children.0', 'object', 'depth', {name: 'c0', children: [{
        name: 'd0'
      }, {
        name: 'd1'
      }]}]
    ]);
  });


  test('object tree (nesting limit inheritance)', function() {
    var registry = new Registry();

    registry.addSchema({
      id: 'tree-node',
      type: 'object',
      depth: 3,
      properties: {
        name: {type: 'string', min: 1},
        children: {
          id: 'children',
          type: 'array',
          optional: true,
          enum: '$id:tree-node'
        }
      }
    });

    assert.strictEqual(registry.depth, 10);
    assert.strictEqual(registry.schemas.children.depth, 3);
  });
});
