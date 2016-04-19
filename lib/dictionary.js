'use strict';
var TYPES = require('./types');



class Dictionary {


  constructor() {
    this.schemas = {};
  }


  render(schema, key) {
    return this._render(schema, key);
  }


  _render(schema, key) {
    key = key || null;
    let list = '*';
    let type = TYPES.BY_ID[schema.type];
    let desc = schema.describe || '{describe}';
    let children = [];

    if (schema.id) {
      if (this.schemas[schema.id]) {
        return this.schemas[schema.id];
      }
      this.schemas[schema.id] = [null, key, null, null, null];
    }


    if (schema.type < TYPES.OBJECT) { // primitives

      if (schema.enum) {
        desc += ', possible values are ' + schema.enum.join(', ');
      }

    } else {
      type = type[0].toUpperCase() + type.substr(1);

      switch (type) {
        case 'Function':
          type = 'function';
          break;

        case 'Array':
          if (schema.content) {
            const r = this._render(schema.content);

            if (r[3]) {
              // children.push(r);
              type += `<${r[0]}>`;
              children = r[3];

            } else {
              type += `<${r[0]}>`;
            }

          } else if (schema.enum) {

            if (schema.ordered) {
              for (let i = 0; i < schema.enum.length; ++i) {
                const r = this._render(schema.enum[i]);

                if (schema.min && i >= schema.min) {
                  r[0] = '?' + r[0] + '=';
                }
                r[4] = (i + 1) + '.';

                children.push(r);
              }

            } else {
              for (let i = 0; i < schema.enum.length; ++i) {
                children.push(this._render(schema.enum[i]));
              }
            }
          }
          break;

        case 'Object':
          if (schema.wildcard) {
            const r = this._render(schema.wildcard);

            if (r[3]) {
              children.push(r);

            } else {
              type += `<string, ${r[0]}>`;
            }
          }

          if (schema.properties) {
            const keys = Object.keys(schema.properties);

            if (keys.length) {
              type += '<string, *>';

              for (let i = 0; i < keys.length; ++i) {
                children.push(this._render(schema.properties[keys[i]], keys[i]));
              }
            }
          }
          break;

        case 'Mixed':
          type = '*';

          for (let i = 0; i < schema.enum.length; ++i) {
            children.push(this._render(schema.enum[i]));
          }
          break;
      }
    }


    if (schema.default) {
      desc += ', defaults to ' + schema.default;
    }

    if (schema.optional) {
      type = '?' + type + '=';
    }


    if (desc === '{describe}') {
      desc = null;
    }
    if (children.length === 0) {
      children = null;
    }

    if (schema.id) {
      this.schemas[schema.id][0] = type;
      this.schemas[schema.id][1] = key;
      this.schemas[schema.id][2] = desc;
      this.schemas[schema.id][3] = children;
      this.schemas[schema.id][4] = list;
      return this.schemas[schema.id];
    }
    return [type, key, desc, children, list];
  }


  print(dictionary) {
    const tab = '  ';
    const markdown = [];

    const print_r = (dict, level) => {
      level = level || 1;

      for (let i = 0; i < dict.length; ++i) {
        let msg = `${tab.repeat(level)} ${dict[i][4]} \`{${dict[i][0]}}`;

        if (dict[i][1]) {
          msg += ` ${dict[i][1]}`;
        }

        msg += '`';

        if (dict[i][2]) {
          msg += ` - ${dict[i][2]}`;
        }

        markdown.push(msg);

        if (dict[i][3]) {
          print_r(dict[i][3], level + 1);
        }
      }
    };

    print_r([dictionary]);

    console.log(markdown.join('\n'));
  }
}


module.exports = function(schema, key) {
  var dictionary = new Dictionary();

  var output = dictionary.render(schema, key);
  dictionary.print(output);
  console.log(JSON.stringify(output));

  return dictionary;
};
