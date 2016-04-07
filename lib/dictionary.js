'use strict';
var TYPES = require('./types');
var renderers = [];



function Dictionary() {
  this.level = 0;
  this.tree = [];
  this._ref = this.tree;

  this.path = [];
  this.current = null;
}


Dictionary.prototype.render = function(key, schema) {
  ++this.level;
  this.path.push(key);
  this.current = key;

  var ref = [];
  var old = this._ref;
  this._ref.push(ref);
  this._ref = ref;

  renderers[schema.type](this, schema);

  --this.level;
  this._ref = old;
  this.path.pop();
  this.current = this.path[this.path.length - 1];
};


Dictionary.prototype.add = function(type) {
  this._ref.push('{' + type + '} ' + this.current);
};


Dictionary.prototype.print = function() {

  function pad(string, length) {
    var abs = Math.abs(length);

    // console.log('padA', string, length, abs);

    if (string.length < abs) {
      if (length < 0) { // prepend
        do {
          string = ' ' + string;
        } while (string.length < abs);

      } else if (abs > 0) { // append
        do {
          string += ' ';
        } while (string.length < abs);
      }
    }

    return string;
  }


  function print_r(x, level) {
    var i;
    level = level || 0;

    for (i = 0; i < x.length; ++i) {
      if (Array.isArray(x[i])) {
        print_r(x[i], level + 1);
      } else {
        console.log(pad('  * `' + x[i] + '`', (x[i].length + 6 + level * 2) * -1));
      }
    }
  }

  print_r(this.tree);
};



module.exports = function(schema) {
  var dictionary = new Dictionary();

  renderers[schema.type](dictionary, schema);

  return dictionary;
};



renderers[TYPES.BOOLEAN] = function(dictionary, schema) {
  dictionary.add('boolean');
};


renderers[TYPES.NUMBER] = function(dictionary, schema) {
  dictionary.add('number');
};


renderers[TYPES.INTEGER] = function(dictionary, schema) {
  dictionary.add('integer');
};


renderers[TYPES.STRING] = function(dictionary, schema) {
  dictionary.add('string');
};


renderers[TYPES.OBJECT] = function(dictionary, schema) {
  var i, keys;

  if (schema.optional) {
    dictionary.add('?Object=');
  } else {
    dictionary.add('Object');
  }

  if (schema.properties) {
    keys = Object.keys(schema.properties);

    for (i = 0; i < keys.length; ++i) {
      dictionary.render(keys[i], schema.properties[keys[i]]);
    }
  }

  if (schema.wildcard) {
    dictionary.render('*', schema.wildcard);
  }
};


renderers[TYPES.ARRAY] = function(dictionary, schema) {
  var i;

  if (schema.optional) {
    dictionary.add('?Array=');
  } else {
    dictionary.add('Array');
  }

  if (schema.content) {
    dictionary.render('*', schema.content);
  }

  if (schema.enum) {
    for (i = 0; i < schema.enum.length; ++i) {

      if (schema.optional) {

      } else if (schema.default) {

      }
      dictionary.render('*', schema.enum[i]);
    }
  }
};


renderers[TYPES.FUNCTION] = function(dictionary, schema) {
  dictionary.add('function');
};


renderers[TYPES.BUFFER] = function(dictionary, schema) {
  dictionary.add('Buffer');
};


renderers[TYPES.MIXED] = function(dictionary, schema) {
  dictionary.add('mixed');
};
