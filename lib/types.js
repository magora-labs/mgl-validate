'use strict';
var types = module.exports = exports;

types.UNKNOWN = 0;
types.UNDEFINED = 1;
types.NULL = 2;

// Primitives
types.BOOLEAN = 4;
types.NUMBER = 8;
types.STRING = 16;

// Objects
types.OBJECT = 32;
types.ARRAY = 64;
types.FUNCTION = 128;

// SSJS specific
types.BUFFER = 256;

// Artificial
types.INTEGER = 512;

// Special Case
types.MIXED = 65536;


types.BY_NAME = {
  'unknown': types.UNKNOWN,
  'undefined': types.UNDEFINED,
  'null': types.NULL,
  'boolean': types.BOOLEAN,
  'number': types.NUMBER,
  'string': types.STRING,
  'object': types.OBJECT,
  'array': types.ARRAY,
  'function': types.FUNCTION,
  'buffer': types.BUFFER,
  'integer': types.INTEGER,
  'mixed': types.MIXED
};

types.BY_ID = {};

types.BY_ID[types.UNKNOWN] = 'unknown';
types.BY_ID[types.UNDEFINED] = 'undefined';
types.BY_ID[types.NULL] = 'null';
types.BY_ID[types.BOOLEAN] = 'boolean';
types.BY_ID[types.NUMBER] = 'number';
types.BY_ID[types.STRING] = 'string';
types.BY_ID[types.OBJECT] = 'object';
types.BY_ID[types.ARRAY] = 'array';
types.BY_ID[types.FUNCTION] = 'function';
types.BY_ID[types.BUFFER] = 'buffer';
types.BY_ID[types.INTEGER] = 'integer';
types.BY_ID[types.MIXED] = 'mixed';
