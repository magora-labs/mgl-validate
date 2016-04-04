'use strict';
var Schema = require('./schema');



/**
 * The schema registry
 *
 * @param {?Object=} opt_options The registry configuration
 * @constructor
 */
function Registry(opt_options) {
  if (!(this instanceof Registry)) {
    return new Registry(opt_options);
  }
  opt_options = opt_options || {};

  this.breakOnError = opt_options.breakOnError || false;
  this.depth = opt_options.depth || 10;

  // regex to match "$schema.*"
  this._match = /"\$id:[a-z0-9_-]*"/ig;
  // regex to escape strings for usage as regex
  this._escape = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

  this.schemas = {};
}
module.exports = Registry;


Registry.prototype.getSchemas = function() {
  return Object.keys(this.schemas);
};


/**
 * @param {string} name Name of the schema to remove
 */
Registry.prototype.removeSchema = function(name) {
  if (!this.schemas[name]) {
    throw new Error('Unknown schema "' + name + '"');
  }
  delete this.schemas[name];
};


/**
 * @param {Object} definition The schema definition
 * @return {Schema}
 */
Registry.prototype.addSchema = function(definition) {
  if (!definition.id) {
    throw new Error('Missing schema id');
  }
  return new Schema(this, definition);
};


/**
 * @param {string} name Name of the schema to validate data against
 * @param {*} data The data to validate
 * @return {Array|null}
 */
Registry.prototype.validate = Registry.prototype.test = function(name, data) {
  if (!this.schemas[name]) {
    throw new Error('Unknown schema "' + name + '"');
  }
  return this.schemas[name].test(data);
};
