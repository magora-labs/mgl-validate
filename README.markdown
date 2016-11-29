# mgl-validate

[![NPM version](https://img.shields.io/npm/v/mgl-validate.svg?style=flat-square)](https://www.npmjs.com/package/mgl-validate)
[![downloads](https://img.shields.io/npm/dm/mgl-validate.svg?style=flat-square)](https://www.npmjs.com/package/mgl-validate)
[![dependencies](https://david-dm.org/magora-labs/mgl-validate.svg)](https://github.com/magora-labs/mgl-validate)
[![devDependencies](https://david-dm.org/magora-labs/mgl-validate/dev-status.svg)](https://github.com/magora-labs/mgl-validate)
[![Build Status](https://secure.travis-ci.org/magora-labs/mgl-validate.png)](http://travis-ci.org/magora-labs/mgl-validate)

**_data object validation_**

*mgl-validate* is a library for validating any variable type, including objects, arrays and primitives, as well as *mixed type* definitions.

Moreover, *mgl-validate* enables the programmer to verify the validity of complex & deeply nested object structures.
The library features defining validation **schemas** to be used as **references**, hence facilitating shared and reusable definitions upon which complex and possibly nested validation schemas can be built.

Schemas are compiled at time of definition to keep performance penalties of actual validations at a minimum.


```js
Stability: 3 - Stable
```

## Table of Contents

 - [Schema](#schema)
 - [API](#api)
 - [Tests](#tests)
 - [License](#license)
 - [ChangeLog](./CHANGELOG.markdown)

## Testimonials

_I really like the notion of adding a schema and referencing it in others - that's just super-cool_

## Example

```js
var registry = require('mgl-validate')({
  breakOnError: true
});

try {
  // create a nested schema
  registry.addSchema({
    id: 'doc',
    type: 'object',
    properties: {
      ref: {
        id: 'uuid',
        type: 'string',
        pattern: '[a-f\\d]{8}(-[a-f\\d]{4}){3}-[a-f\\d]{12}'
      }
    }
  });
} catch (err) {
  return console.log(err.message);
}

var errors;

// validate against 'doc'
errors = registry.test('doc', {ref: 'THIS-IS-NOT-AN-UUID'});
if (errors) {
  console.log(errors);
}

// ... or validate directly against 'uuid'
errors = registry.test('uuid', 'THIS-IS-NOT-AN-UUID');
if (errors) {
  console.log(errors);
}
```

[back to top](#table-of-contents)

## Types

  - `null`
  - `boolean`
  - `number`
  - `integer` - validates as `number` too
  - `string`
  - `array`
  - `object`
  - `buffer`
  - `function`
  - `mixed`

## Schema
See [`tests`](./test/) for examples covering all use cases.

The options are processed in the following order; `type optional value min < max < enum < pattern properties`, where `A < B` means that `B` is only tested when `A` didn't fail.

**properties**

  * `{?string=} id` - The schema id, when given the schema can be referenced
  * `{string} type` - The data type; See [Types](#types)
  * `{?number=} depth` - Absolute nesting limit for validated data, defaults to `10`
  * `{?boolean=} optional` - When `true`, the value may be `undefined`
  * `{?*=} default` - A default value, implies `optional: true`
  * `{?string=} pattern` - An encoded regular-expression for string validation
  * `{?string=} flags` - Regular-expression flags
  * `{?number=} min` - Minimum number _of chars, elements, properties, arguments_
  * `{?number=} max` - Maximum number _of chars, elements, properties, arguments_
  * `{?Object<string, (Object|string)>=} properties` - A map with schemas for each property of an object
  * `{?boolean=} allowUnknownProperties` - When `true`, an object may contain properties that don't have a schema
  * `{?(Array|Object|string)=} enum` - Validate values against given primitives and/or schemas
  * `{?boolean=} ordered` - When `true`, an array is matched against `enum` in order
  * `{?boolean=} allowNullValue` - When `true`, the affected schema's value may be `null`

### enum
Validate values against given values and/or schemas.

  NOTE: The most likely values should be placed at the top of the enum array to improve validation performance.

**Types:** `number`, `integer`, `string`, `array`, `mixed`

#### Primitives
Primitive data types can be validated against a list of static values of their own type;

```js
{ type: 'number', // or 'integer' or 'string'
  enum: [1, 2, 3]
}
```

#### `type: array`
Arrays support multiple combinations for `enum`;

_... a single schema_, either as reference (`$id:<name>`) or object. All elements in the array now have to comply to the given schema.

```js
{ type: 'array',
  enum: '$id:uuid'
}
```

_... an array of schemas and/or primitives_. Any element in the array has to comply to any of the supplied schemas. When `ordered: true`, the elements of the array have to comply to the given schemas in order.

```js
{ type: 'array',
  ordered: true,
  enum: [
    '$id:uuid',
    false,
    {type: 'integer'}
  ]
}
```

_In the above example the 2nd, 5th, 8th, ... element of any array has to be `false` in order to pass the test_

Validation restarts at the first element of the given `enum` if the number of elements t.b. validated exceeds the given schemas.
This behaviour can be further controlled with the `min` and `max` options.

#### `type: mixed`
`enum` for `type: mixed` works exactly like for `type: array` with an array of schemas and/or primitives, but with respect to a single value.

### properties
An object with properties where each value is a primitive value, schema object or reference.

**Types:** `object`, `function`

```js
{ type: 'object',
  properties: {
    xyz: {
      type: 'number'
    },
    abc: '$id:other',     // has to match "other" schema
    wtf: 'abc',           // primitive equals match
    ...
  }
}
```

#### wildcard

**Types:** `object`

```js
{ type: 'object',
  properties: {
    '*': {                // all unknown properties have to match this schema
      type: 'string',
      ...
    },
    ...
  }
}
```


### min & max
A number that describes the minimum ...

 - value for a `number` or an `integer`
 - length for a `string`
 - length for an `array`
 - number of arguments for a `function`
 - number of properties on an `object`

**Types:** `number`, `integer`, `string`, `array`, `object`, `function`

_Note: When `min` fails, the test for `max` is omitted for logical reasons._


### pattern
A string to be used for `new RegExp()`.

**Types:** `string`

#### flags

**Types:** `string`


### optional
When `true` the value may be `undefined`, type violations other than `undefined` produce an error.

**Types: ALL**


### default
_**Works ONLY for object properties!**_

Apply a default value if `undefined`.

**Types:** `number`, `integer`, `string`, `array`, `function`


### allowUnknownProperties
Allows an object to have properties not specified in the schema.
Defaults to `true` for `function` and to `false` for `object`.

**Types:** `object`, `function`


[back to top](#table-of-contents)

## API

### Class: Registry
#### new Registry(opt_options)

 * `{?Object=} opt_options`
   * `{?boolean=} breakOnError` - defaults to `false`
   * `{?number=} depth` - Global nesting limit, defaults to `10`. Can be overridden by each schema

#### registry.breakOnError

#### registry.getSchemas()

#### registry.addSchema(definition)

#### registry.removeSchema(schema)

#### registry.test(schema, data);
See `schema.test()`.

### Class: Schema
#### new Schema(registry, definition)

#### schema.test(data)
Validate given data, returns validation errors as array, `null` otherwise.

An annotated example;

```js
[
  [<pathToValue>, <expectedType>, <reason>, <offendingValue>],

  // property b of object a is undefined
  ['a', 'object', 'undefined', 'b'],

  // property c of object a is not of type string
  ['a.c', 'string', 'type', 2],

  // property e of the 1st element of the array at property d of object a is too small
  ['a.d.0.e', 'number', 'min', -1],
  ...
]
```

#### schema.typeOf(value)

[back to top](#table-of-contents)

## Tests

```bash
npm test
firefox coverage/lcov-report/index.html
```

### Coverage

```
Statements   : 99.37% ( 317/319 )
Branches     : 97.74% ( 260/266 )
Functions    : 100% ( 21/21 )
Lines        : 99.37% ( 317/319 )
```

[back to top](#table-of-contents)

## License

(The MIT license)

Copyright (c) 2015 Magora Group GmbH, Austria (www.magora.at)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[back to top](#table-of-contents)
