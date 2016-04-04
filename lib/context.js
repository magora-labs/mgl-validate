'use strict';
var TYPES = require('./types');



/**
 * @constructor
 */
function Context() {
  this.level = -1;
  this.schemas = [];
  this.keys = [];
  this.errors = [];
}
module.exports = Context;


/**
 * @param {Schema} schema The current schema
 * @param {(string|number)} opt_key The property name or array index
 */
Context.prototype.up = function(schema, opt_key) {
  ++this.level;
  this.schemas.push(schema);

  if (opt_key !== undefined) {
    this.keys.push('' + opt_key);
  }
};


Context.prototype.down = function() {
  --this.level;
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
    TYPES.BY_ID[this.schemas[this.level].type],
    reason,
    offendingValue
  ]);
};
