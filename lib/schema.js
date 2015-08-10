'use strict';
var TYPES = require('./types');
var Context = require('./context');



/**
 * @param {Registry} registry The registry object
 * @param {Object} definition The schema definition
 *
 * @constructor
 */
function Schema(registry, definition) {
  this._allowUnknownProperties = false;
  this._registry = registry;

  this.id = undefined;
  this.type = TYPES.UNKNOWN;

  // possible primitive values or array elements
  this.enum = undefined;

  // object property schemas
  this.properties = undefined;
  this.propertiesList = [];
  this.wildcard = undefined;

  // array elements schema
  this.content = undefined;

  this.value = undefined;
  this.min = undefined;
  this.max = undefined;
  this.pattern = undefined;

  return this._configure(definition);
}
module.exports = Schema;


/**
 * @param {Object} definition The schema definition
 * @throws {Error}
 * @return {Schema} this
 */
Schema.prototype._configure = function(definition) {
  var i, keys, tmp;
  tmp = this.typeOf(definition);

  if (tmp === TYPES.ARRAY) {
    throw new Error('Invalid schema definition');

  // handle schema references
  } else if (tmp === TYPES.STRING && definition.substr(0, 4) === '$id:') {
    tmp = definition.substr(4);

    if (!this._registry.schemas[tmp]) {
      throw new Error('Unknown reference schema "' + tmp + '"');
    }
    return this._registry.schemas[tmp];

  // handle primitive matching
  } else if (tmp !== TYPES.OBJECT) {
    this.type = tmp;
    this.value = definition;
    return this;
  } else if (definition.type === undefined) {
    throw new Error('Invalid type definition');
  }

  if (typeof TYPES.BY_NAME[definition.type] !== 'number') {
    throw new Error('Unknown type \'' + definition.type + '\'');
  }

  this.id = definition.id;
  this.type = TYPES.BY_NAME[definition.type];

  this.default = definition.default !== undefined ?
      definition.default : undefined;
  this.optional = definition.optional ? true : false;

  if (this.type === TYPES.UNKNOWN) {
    throw new Error('Unknown type');

  // PRIMITIVE or ARRAY
  } else if (this.type === TYPES.NUMBER ||
      this.type === TYPES.INTEGER ||
      this.type === TYPES.STRING ||
      this.type === TYPES.ARRAY) {

    if (typeof definition.min === 'number') {
      this.min = definition.min;
    }

    if (typeof definition.max === 'number') {
      this.max = definition.max;
    }

    if (definition.enum !== undefined) {
      if (Array.isArray(definition.enum)) {
        keys = definition.enum.slice();
        tmp = this.typeOf(keys[0]);

        if (tmp === TYPES.STRING ||
            tmp === TYPES.NUMBER ||
            tmp === TYPES.INTEGER) {

          for (i = 1; i < keys.length; ++i) {
            if (tmp !== this.typeOf(keys[i])) {
              throw new Error('Mixed values in enum definition');
            }
          }
          this.enum = keys;

        } else {
          throw new Error('Non-primitive values in enum definition');
        }

      } else if (typeof definition.enum === 'object') {
        this.content = new Schema(this._registry, definition.enum);

      } else if (typeof definition.enum === 'string') {
        this.content = new Schema(this._registry, definition.enum);

      } else {
        throw new Error('Invalid enum definition');
      }
    }

    if (this.type === TYPES.STRING && definition.pattern) {
      this.pattern = new RegExp(definition.pattern, definition.flags);
    }

  // OBJECT or FUNCTION
  } else if (this.type === TYPES.OBJECT || this.type === TYPES.FUNCTION) {
    this._allowUnknownProperties =
        definition.allowUnknownProperties || this.type === TYPES.FUNCTION;

    // number of arguments
    if (typeof definition.min === 'number') {
      this.min = definition.min;
    }
    if (typeof definition.max === 'number') {
      this.max = definition.max;
    }

    if (definition.properties) {
      if (this.typeOf(definition.properties) !== TYPES.OBJECT) {
        throw new Error('Invalid properties definition');
      }

      this.propertiesList = keys = Object.keys(definition.properties);
      this.properties = {};

      for (i = 0; i < keys.length; ++i) {
        if (keys[i] === '*' && this.type === TYPES.OBJECT) {
          this.wildcard =
              new Schema(this._registry, definition.properties[keys[i]]);

          this.propertiesList.splice(i, 1);
          --i;
        } else {
          this.properties[keys[i]] =
              new Schema(this._registry, definition.properties[keys[i]]);
        }
      }
    }

  // MIXED
  } else if (this.type === TYPES.MIXED) {
    if (!Array.isArray(definition.enum)) {
      throw new Error('Invalid enum definition');
    }
    keys = definition.enum.slice();
    this.enum = new Array(keys.length);

    for (i = 0; i < keys.length; ++i) {
      this.enum[i] = new Schema(this._registry, keys[i]);
    }
  }
};


/**
 * @param {*} value The data to validate
 * @return {?Error}
 */
Schema.prototype.validate = Schema.prototype.test = function(value) {
  var err;
  var context = new Context();

  this._validate(value, context);

  if (context.errors.length > 0) {
    err = new Error('Validation failed');
    err.validation = context.errors;
    return err;
  }
};


/**
 * @param {*} value The data to validate
 * @param {Context} context The validation context
 * @param {?string=} opt_key Optional data key
 */
Schema.prototype._validate = function(value, context, opt_key) {
  var type;

  if (this._registry.breakOnError && context.errors.length > 0) {
    return;
  }

  type = this.typeOf(value);
  context.up(this, opt_key);

  if (type === TYPES.UNDEFINED) {
    if (!this.optional) {
      context.error('type', value);
    }

  } else if (this.type === TYPES.MIXED) {
    this._validateMixed(value, context);

  // handle type mismatches
  } else if (this.type !== type &&
      !(this.type === TYPES.NUMBER && type === TYPES.INTEGER)) {
    context.error('type', value);

  // extended validation
  } else {
    switch (type) {
      case TYPES.BOOLEAN:
        if (this.value !== undefined && this.value !== value) {
          context.error('value', value);
        }
        break;

      case TYPES.STRING:
        this._validateString(value, context);
        break;

      case TYPES.INTEGER:
        /* falls through */

      case TYPES.NUMBER:
        this._validateNumber(value, context);
        break;

      case TYPES.ARRAY:
        this._validateArray(value, context);
        break;

      case TYPES.FUNCTION:
        this._validateFunction(value, context);
        break;

      case TYPES.OBJECT:
        this._validateObject(value, context);
        break;
    }
  }

  context.down();
};


/**
 * Validate a mixed value
 *
 * @param {*} value The data to validate
 * @param {Context} context The validation context
 */
Schema.prototype._validateMixed = function(value, context) {
  var i, j, k;

  // memorize error count (total, round)
  k = j = context.errors.length;

  for (i = 0; i < this.enum.length; ++i) {
    this.enum[i]._validate(value, context, '*');

    // no errors; matching schema found
    if (context.errors.length === j) {
      // remove errors of previously tested schema
      context.errors = context.errors.slice(0, k);
      break;
    }

    // memorize error count for next round
    j = context.errors.length;
  }
};


/**
 * Validate a string
 *
 * @param {Array} value The data to validate
 * @param {Context} context The validation context
 */
Schema.prototype._validateString = function(value, context) {
  if (this.value && this.value !== value) {
    context.error('value', value);

  } else if (this.min !== undefined && value.length < this.min) {
    context.error('min', value.length);

  } else if (this.max !== undefined && value.length > this.max) {
    context.error('max', value.length);

  } else if (this.enum && this.enum.indexOf(value) === -1) {
    context.error('enum', value);

  } else if (this.pattern && !this.pattern.test(value)) {
    context.error('pattern', value);
  }
};


/**
 * Validate a number
 *
 * @param {number} value The data to validate
 * @param {Context} context The validation context
 */
Schema.prototype._validateNumber = function(value, context) {
  if (this.value !== undefined && this.value !== value) {
    context.error('value', value);

  } else if (this.min !== undefined && value < this.min) {
    context.error('min', value);

  } else if (this.max !== undefined && value > this.max) {
    context.error('max', value);

  } else if (this.enum && this.enum.indexOf(value) === -1) {
    context.error('enum', value);
  }
};


/**
 * Validate an array
 *
 * @param {Array} value The data to validate
 * @param {Context} context The validation context
 */
Schema.prototype._validateArray = function(value, context) {
  var i;

  if (this.min !== undefined && value.length < this.min) {
    context.error('min', value.length);

  } else if (this.max !== undefined && value.length > this.max) {
    context.error('max', value.length);

  } else if (value.length > 0) {
    if (this.content) {
      for (i = 0; i < value.length; ++i) {
        this.content._validate(value[i], context, i);
      }

    } else if (this.enum) {
      for (i = 0; i < value.length; ++i) {
        if (this.enum.indexOf(value[i]) === -1) {
          context.error('enum', value[i]);
        }
      }
    }
  }
};


/**
 * Validate an object
 *
 * @param {Object|Function} value The data to validate
 * @param {Context} context The validation context
 */
Schema.prototype._validateObject = function(value, context) {
  var i, keys;

  if (this.wildcard) {
    keys = Object.keys(value);

    for (i = 0; i < keys.length; ++i) {
      if (this.propertiesList.indexOf(keys[i]) === -1) {
        this.wildcard._validate(value[keys[i]], context, keys[i]);
      }
    }

  } else if (!this._allowUnknownProperties) {
    keys = Object.keys(value);

    for (i = 0; i < keys.length; ++i) {
      if (this.propertiesList.indexOf(keys[i]) === -1) {
        context.error('unknown', keys[i]);
      }
    }
  }

  // validate object property count
  if (this.min !== undefined || this.max !== undefined) {
    keys = keys || Object.keys(value);

    if (this.min !== undefined && keys.length < this.min) {
      context.error('min', keys.length);

    } else if (this.max !== undefined && keys.length > this.max) {
      context.error('max', keys.length);
    }
  }

  this._validateProperties(value, context);
};


/**
 * Validate a function
 *
 * @param {Function} value The data to validate
 * @param {Context} context The validation context
 */
Schema.prototype._validateFunction = function(value, context) {
  if (this.min !== undefined && value.length < this.min) {
    context.error('min', value.length);
  } else if (this.max !== undefined && value.length > this.max) {
    context.error('max', value.length);
  }

  this._validateProperties(value, context);
};


/**
 * Validate object properties
 *
 * @param {Object|Function} value The data to validate
 * @param {Context} context The validation context
 */
Schema.prototype._validateProperties = function(value, context) {
  var i;

  // validate object property definitions
  for (i = 0; i < this.propertiesList.length; ++i) {
    if (value[this.propertiesList[i]] === undefined &&
        !this.properties[this.propertiesList[i]].optional) {
      if (this.properties[this.propertiesList[i]].default !== undefined) {
        value[this.propertiesList[i]] =
            this.properties[this.propertiesList[i]].default;
      } else {
        context.error('undefined', this.propertiesList[i]);
      }

    } else {
      this.properties[this.propertiesList[i]]._validate(
          value[this.propertiesList[i]],
          context,
          this.propertiesList[i]);
    }
  }
};


Schema.prototype.typeOf = function(value) {
  var type;

  if (value === undefined) {
    return TYPES.UNDEFINED;

  // FACT: (typeof null) === 'object'
  } else if (value === null) {
    return TYPES.NULL;
  }

  type = typeof value;

  switch (type) {
    case 'boolean':
      return TYPES.BOOLEAN;

    case 'string':
      return TYPES.STRING;

    case 'number':
      if (value === Math.floor(value)) {
        return TYPES.INTEGER;
      }
      return TYPES.NUMBER;

    case 'object':
      if (Array.isArray(value)) {
        return TYPES.ARRAY;
      } else if (Buffer.isBuffer(value)) {
        return TYPES.BUFFER;
      }
      return TYPES.OBJECT;

    case 'function':
      return TYPES.FUNCTION;
    default:
      return TYPES.UNKNOWN;
  }
};
