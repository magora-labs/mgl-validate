# mgl-validate

[![Build Status](https://secure.travis-ci.org/magora-labs/mgl-validate.png)](http://travis-ci.org/magora-labs/mgl-validate)

**_data object validation_**

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
var err, registry = require('mgl-validate')({
  breakOnError: true
});

// create 1st schema
err = registry.addSchema({
  id: 'uuid',
  type: 'string',
  pattern: '[a-f\\d]{8}(-[a-f\\d]{4}){3}-[a-f\\d]{12}'
});

if (err) {
  console.log(err.message);
}

// create 2nd schema (referencing the 1st)
err = registry.addSchema({
  id: 'doc',
  type: 'object',
  properties: {
    id: '$id:uuid'
  }
});

if (err) {
  console.log(err.message);
}

// validate
err = registry.test('doc', {id: 'THIS-IS-NOT-AN-UUID'});

if (err) {
  console.log(err.validation);
}
```

[back to top](#table-of-contents)

## Schema

See `test/test-schema.js` for more examples.

The options are processed in the following order; `type optional value min < max < enum < pattern  properties`, where `A < B` means that `B` is only tested when `A` didn't fail.


### id
A string for later reference.

### type
See `lib/types.js` for details.

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

### enum
An array with non-mixed primitive values

**Types:** `number`, `integer`, `string`, `array`, `mixed`

```js
{ type: 'number',
  enum: [1, 2, 3]
}
```

... a single schema object

```js
{ type: 'string',
  enum: {
    type: 'string',   // seems superfluous, but is required
    pattern: '[a-f\\d]{8}(-[a-f\\d]{4}){3}-[a-f\\d]{12}'
  }
}
```

... a reference

```js
{ type: 'array',
  enum: '$id:schemaA'
}
```

... or an array of definitions when `type: 'mixed'`.

```js
{ type: 'mixed',
  enum: [             // Values will be checked against given schema in order.
    '$id:schemaA',    //   Put the most likely at the top!
    '$id:schemaB',
    {
      type: 'integer'
    }
  ]
}
```

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


### property wildcard

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


### flags
See `pattern`.

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
   * `{boolean} breakOnError` - defaults to `false`

#### registry.breakOnError

#### registry.getSchemas()

#### registry.addSchema(definition)

#### registry.removeSchema(schema)

#### registry.test(schema, data);
See `schema.test()`.

### Class: Schema
#### new Schema(registry, definition)

#### schema.test(data)
Returns an `Error` on failed validation.

An annotated example error;

```js
{ message: 'Validation failed',
  validation: [
    [<pathToValue>, <expectedType>, <reason>, <offendingValue>],

    // property b of object a is undefined
    ['a', 'object', 'undefined', 'b'],

    // property c of object a is not of type string
    ['a.c', 'string', 'type', 2],

    // property e of the 1st element of the array at property d of object a is too small
    ['a.d.0.e', 'number', 'min', -1],
    ...
  ]
}
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
Statements   : 99.32% ( 291/293 )
Branches     : 98.65% ( 219/222 )
Functions    : 100% ( 21/21 )
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
