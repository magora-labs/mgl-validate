'use strict';
var TYPES = require('./types');



/**
 * @constructor
 */
function Context() {
  // reverse schema stack (deepest schema is at index 0)
  this.schemas = [];

  this._i = -1;

  // data key stack
  this.keys = [];

  this.errors = [];
}
module.exports = Context;


/**
 * @param {Schema} schema The current schema
 * @param {(string|number)} opt_key The property name or array index
 */
Context.prototype.up = function(schema, opt_key) {
  this.schemas.push(schema);
  ++this._i;

  if (opt_key !== undefined) {
    this.keys.push('' + opt_key);
  }
};


Context.prototype.down = function() {
  --this._i;
  this.schemas.pop();
  this.keys.pop();
};


/**
 * @param {string} reason Why is is an error
 * @param {*} offendingValue The value that did not match
 */
Context.prototype.error = function(reason, offendingValue) {
  this.errors.push([
    this.keys.join('.') || null,
    TYPES.BY_ID[this.schemas[this._i].type],
    reason,
    offendingValue
  ]);
};
