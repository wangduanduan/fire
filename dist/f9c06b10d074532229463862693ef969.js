// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      function localRequire(x) {
        return newRequire(localRequire.resolve(x));
      }

      localRequire.resolve = function (x) {
        return modules[name][1][x] || x;
      };

      var module = cache[name] = new newRequire.Module;
      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Define a struct error.
 *
 * @type {StructError}
 */

class StructError extends TypeError {

  constructor(attrs) {
    const { data, value, type, path, reason, errors = [] } = attrs;
    const message = `Expected a value of type \`${type}\`${path.length ? ` for \`${path.join('.')}\`` : ''} but received \`${JSON.stringify(value)}\`.`;
    super(message);
    this.data = data;
    this.path = path;
    this.value = value;
    this.type = type;
    this.reason = reason;
    this.errors = errors;
    if (!errors.length) errors.push(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
  }

}

var toString = Object.prototype.toString;

var kindOf = function kindOf(val) {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';

  var type = typeof val;
  if (type === 'boolean') return 'boolean';
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'symbol') return 'symbol';
  if (type === 'function') {
    return isGeneratorFn(val) ? 'generatorfunction' : 'function';
  }

  if (isArray(val)) return 'array';
  if (isBuffer(val)) return 'buffer';
  if (isArguments(val)) return 'arguments';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  if (isRegexp(val)) return 'regexp';

  switch (ctorName(val)) {
    case 'Symbol':
      return 'symbol';
    case 'Promise':
      return 'promise';

    // Set, Map, WeakSet, WeakMap
    case 'WeakMap':
      return 'weakmap';
    case 'WeakSet':
      return 'weakset';
    case 'Map':
      return 'map';
    case 'Set':
      return 'set';

    // 8-bit typed arrays
    case 'Int8Array':
      return 'int8array';
    case 'Uint8Array':
      return 'uint8array';
    case 'Uint8ClampedArray':
      return 'uint8clampedarray';

    // 16-bit typed arrays
    case 'Int16Array':
      return 'int16array';
    case 'Uint16Array':
      return 'uint16array';

    // 32-bit typed arrays
    case 'Int32Array':
      return 'int32array';
    case 'Uint32Array':
      return 'uint32array';
    case 'Float32Array':
      return 'float32array';
    case 'Float64Array':
      return 'float64array';
  }

  if (isGeneratorObj(val)) {
    return 'generator';
  }

  // Non-plain objects
  type = toString.call(val);
  switch (type) {
    case '[object Object]':
      return 'object';
    // iterators
    case '[object Map Iterator]':
      return 'mapiterator';
    case '[object Set Iterator]':
      return 'setiterator';
    case '[object String Iterator]':
      return 'stringiterator';
    case '[object Array Iterator]':
      return 'arrayiterator';
  }

  // other
  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
};

function ctorName(val) {
  return val.constructor ? val.constructor.name : null;
}

function isArray(val) {
  if (Array.isArray) return Array.isArray(val);
  return val instanceof Array;
}

function isError(val) {
  return val instanceof Error || typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number';
}

function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === 'function' && typeof val.getDate === 'function' && typeof val.setDate === 'function';
}

function isRegexp(val) {
  if (val instanceof RegExp) return true;
  return typeof val.flags === 'string' && typeof val.ignoreCase === 'boolean' && typeof val.multiline === 'boolean' && typeof val.global === 'boolean';
}

function isGeneratorFn(name, val) {
  return ctorName(name) === 'GeneratorFunction';
}

function isGeneratorObj(val) {
  return typeof val.throw === 'function' && typeof val.return === 'function' && typeof val.next === 'function';
}

function isArguments(val) {
  try {
    if (typeof val.length === 'number' && typeof val.callee === 'function') {
      return true;
    }
  } catch (err) {
    if (err.message.indexOf('callee') !== -1) {
      return true;
    }
  }
  return false;
}

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer(val) {
  if (val.constructor && typeof val.constructor.isBuffer === 'function') {
    return val.constructor.isBuffer(val);
  }
  return false;
}

/**
 * A private string to identify structs by.
 *
 * @type {String}
 */

const IS_STRUCT = '@@__STRUCT__@@';

/**
 * A private string to refer to a struct's kind.
 *
 * @type {String}
 */

const KIND = '@@__KIND__@@';

/**
 * Check if a `value` is a struct.
 *
 * @param {Any} value
 * @return {Boolean}
 */

function isStruct(value) {
  return !!(value && value[IS_STRUCT]);
}

/**
 * Resolve `defaults`, for an optional `value`.
 *
 * @param {Function|Any} defaults
 * @param {Any} value
 * @return {Any}
 */

function resolveDefaults(defaults, value) {
  return typeof defaults === 'function' ? defaults(value) : defaults;
}

/**
 * Kind.
 *
 * @type {Kind}
 */

class Kind {

  constructor(name, type, validate) {
    this.name = name;
    this.type = type;
    this.validate = validate;
  }

}

/**
 * Any.
 *
 * @param {Array|Function|Object|String} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function any(schema, defaults, options) {
  if (isStruct(schema)) return schema[KIND];
  if (schema instanceof Kind) return schema;

  switch (kindOf(schema)) {
    case 'array':
      {
        return schema.length > 1 ? tuple(schema, defaults, options) : list(schema, defaults, options);
      }

    case 'function':
      {
        return func(schema, defaults, options);
      }

    case 'object':
      {
        return object(schema, defaults, options);
      }

    case 'string':
      {
        let required = true;
        let type;

        if (schema.endsWith('?')) {
          required = false;
          schema = schema.slice(0, -1);
        }

        if (schema.includes('|')) {
          const scalars = schema.split(/\s*\|\s*/g);
          type = union(scalars, defaults, options);
        } else if (schema.includes('&')) {
          const scalars = schema.split(/\s*&\s*/g);
          type = intersection(scalars, defaults, options);
        } else {
          type = scalar(schema, defaults, options);
        }

        if (!required) {
          type = optional(type, undefined, options);
        }

        return type;
      }
  }

  if ("development" !== 'production') {
    throw new Error(`A schema definition must be an object, array, string or function, but you passed: ${schema}`);
  } else {
    throw new Error(`Invalid schema: ${schema}`);
  }
}

/**
 * Dict.
 *
 * @param {Array} schema
 * @param {Object} defaults
 * @param {Object} options
 */

function dict(schema, defaults, options) {
  if (kindOf(schema) !== 'array' || schema.length !== 2) {
    if ("development" !== 'production') {
      throw new Error(`Dict structs must be defined as an array with two elements, but you passed: ${schema}`);
    } else {
      throw new Error(`Invalid schema: ${schema}`);
    }
  }

  const obj = scalar('object', undefined, options);
  const keys = any(schema[0], undefined, options);
  const values = any(schema[1], undefined, options);
  const name = 'dict';
  const type = `dict<${keys.type},${values.type}>`;
  const validate = (value = resolveDefaults(defaults)) => {
    const [error] = obj.validate(value);

    if (error) {
      error.type = type;
      return [error];
    }

    const ret = {};
    const errors = [];

    for (let k in value) {
      const v = value[k];
      const [e, r] = keys.validate(k);

      if (e) {
        e.path = [k].concat(e.path);
        e.data = value;
        errors.push(e);
        continue;
      }

      k = r;
      const [e2, r2] = values.validate(v);

      if (e2) {
        e2.path = [k].concat(e2.path);
        e2.data = value;
        errors.push(e2);
        continue;
      }

      ret[k] = r2;
    }

    if (errors.length) {
      const first = errors[0];
      first.errors = errors;
      return [first];
    }

    return [undefined, ret];
  };

  return new Kind(name, type, validate);
}

/**
 * Enum.
 *
 * @param {Array} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function en(schema, defaults, options) {
  if (kindOf(schema) !== 'array') {
    if ("development" !== 'production') {
      throw new Error(`Enum structs must be defined as an array, but you passed: ${schema}`);
    } else {
      throw new Error(`Invalid schema: ${schema}`);
    }
  }

  const name = 'enum';
  const type = schema.map(s => {
    try {
      return JSON.stringify(s);
    } catch (e) {
      return String(s);
    }
  }).join(' | ');

  const validate = (value = resolveDefaults(defaults)) => {
    return schema.includes(value) ? [undefined, value] : [{ data: value, path: [], value, type }];
  };

  return new Kind(name, type, validate);
}

/**
 * Enums.
 *
 * @param {Array} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function enums(schema, defaults, options) {
  const e = en(schema, undefined, options);
  const l = list([e], defaults, options);
  return l;
}

/**
 * Function.
 *
 * @param {Function} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function func(schema, defaults, options) {
  if (kindOf(schema) !== 'function') {
    if ("development" !== 'production') {
      throw new Error(`Function structs must be defined as a function, but you passed: ${schema}`);
    } else {
      throw new Error(`Invalid schema: ${schema}`);
    }
  }

  const name = 'function';
  const type = '<function>';
  const validate = (value = resolveDefaults(defaults), data) => {
    const result = schema(value, data);
    const isReason = kindOf(result) === 'string';
    const isBoolean = kindOf(result) === 'boolean';

    if (!isReason && !isBoolean) {
      if ("development" !== 'production') {
        throw new Error(`Validator functions must return a boolean or an error reason string, but you passed: ${schema}`);
      } else {
        throw new Error(`Invalid result: ${result}`);
      }
    }

    const isValid = isReason ? false : result;
    const reason = isReason ? result : undefined;

    return isValid ? [undefined, value] : [{ type, value, data: value, path: [], reason }];
  };

  return new Kind(name, type, validate);
}

/**
 * Instance.
 *
 * @param {Array} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function instance(schema, defaults, options) {
  const name = 'instance';
  const type = `instance<${schema.name}>`;
  const validate = (value = resolveDefaults(defaults)) => {
    return value instanceof schema ? [undefined, value] : [{ data: value, path: [], value, type }];
  };

  return new Kind(name, type, validate);
}

/**
 * Interface.
 *
 * @param {Object} schema
 * @param {Object} defaults
 * @param {Object} options
 */

function inter(schema, defaults, options) {
  if (kindOf(schema) !== 'object') {
    if ("development" !== 'production') {
      throw new Error(`Interface structs must be defined as an object, but you passed: ${schema}`);
    } else {
      throw new Error(`Invalid schema: ${schema}`);
    }
  }

  const ks = [];
  const properties = {};

  for (const key in schema) {
    ks.push(key);
    const s = schema[key];
    const kind = any(s, undefined, options);
    properties[key] = kind;
  }

  const name = 'interface';
  const type = `{${ks.join()}}`;
  const validate = (value = resolveDefaults(defaults)) => {
    const errors = [];

    for (const key in properties) {
      const v = value[key];
      const kind = properties[key];
      const [e] = kind.validate(v);

      if (e) {
        e.path = [key].concat(e.path);
        e.data = value;
        errors.push(e);
        continue;
      }
    }

    if (errors.length) {
      const first = errors[0];
      first.errors = errors;
      return [first];
    }

    return [undefined, value];
  };

  return new Kind(name, type, validate);
}

/**
 * Lazy.
 *
 * @param {Function} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function lazy(schema, defaults, options) {
  if (kindOf(schema) !== 'function') {
    if ("development" !== 'production') {
      throw new Error(`Lazy structs must be defined as an function that returns a schema, but you passed: ${schema}`);
    } else {
      throw new Error(`Invalid schema: ${schema}`);
    }
  }

  let kind;
  let struct;
  const name = 'lazy';
  const type = `lazy...`;
  const compile = value => {
    struct = schema();
    kind.name = struct.kind;
    kind.type = struct.type;
    kind.validate = struct.validate;
    return kind.validate(value);
  };

  kind = new Kind(name, type, compile);
  return kind;
}

/**
 * List.
 *
 * @param {Array} schema
 * @param {Array} defaults
 * @param {Object} options
 */

function list(schema, defaults, options) {
  if (kindOf(schema) !== 'array' || schema.length !== 1) {
    if ("development" !== 'production') {
      throw new Error(`List structs must be defined as an array with a single element, but you passed: ${schema}`);
    } else {
      throw new Error(`Invalid schema: ${schema}`);
    }
  }

  const array = scalar('array', undefined, options);
  const element = any(schema[0], undefined, options);
  const name = 'list';
  const type = `[${element.type}]`;
  const validate = (value = resolveDefaults(defaults)) => {
    const [error, result] = array.validate(value);

    if (error) {
      error.type = type;
      return [error];
    }

    value = result;
    const errors = [];
    const ret = [];

    for (let i = 0; i < value.length; i++) {
      const v = value[i];
      const [e, r] = element.validate(v);

      if (e) {
        e.path = [i].concat(e.path);
        e.data = value;
        errors.push(e);
        continue;
      }

      ret[i] = r;
    }

    if (errors.length) {
      const first = errors[0];
      first.errors = errors;
      return [first];
    }

    return [undefined, ret];
  };

  return new Kind(name, type, validate);
}

/**
 * Literal.
 *
 * @param {Array} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function literal(schema, defaults, options) {
  const name = 'literal';
  const type = `literal: ${JSON.stringify(schema)}`;
  const validate = (value = resolveDefaults(defaults)) => {
    return value === schema ? [undefined, value] : [{ data: value, path: [], value, type }];
  };

  return new Kind(name, type, validate);
}

/**
 * Object.
 *
 * @param {Object} schema
 * @param {Object} defaults
 * @param {Object} options
 */

function object(schema, defaults, options) {
  if (kindOf(schema) !== 'object') {
    if ("development" !== 'production') {
      throw new Error(`Object structs must be defined as an object, but you passed: ${schema}`);
    } else {
      throw new Error(`Invalid schema: ${schema}`);
    }
  }

  const obj = scalar('object', undefined, options);
  const ks = [];
  const properties = {};

  for (const key in schema) {
    ks.push(key);
    const s = schema[key];
    const kind = any(s, undefined, options);
    properties[key] = kind;
  }

  const name = 'object';
  const type = `{${ks.join()}}`;
  const validate = (value = resolveDefaults(defaults)) => {
    const [error] = obj.validate(value);

    if (error) {
      error.type = type;
      return [error];
    }

    const errors = [];
    const ret = {};
    const valueKeys = Object.keys(value);
    const propertiesKeys = Object.keys(properties);
    const keys = new Set(valueKeys.concat(propertiesKeys));

    keys.forEach(key => {
      let v = value[key];
      const kind = properties[key];

      if (v === undefined) {
        const d = defaults && defaults[key];
        v = resolveDefaults(d, value);
      }

      if (!kind) {
        const e = { data: value, path: [key], value: v };
        errors.push(e);
        return;
      }

      const [e, r] = kind.validate(v, value);

      if (e) {
        e.path = [key].concat(e.path);
        e.data = value;
        errors.push(e);
        return;
      }

      if (key in value || r !== undefined) {
        ret[key] = r;
      }
    });

    if (errors.length) {
      const first = errors[0];
      first.errors = errors;
      return [first];
    }

    return [undefined, ret];
  };

  return new Kind(name, type, validate);
}

/**
 * Optional.
 *
 * @param {Any} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function optional(schema, defaults, options) {
  return union([schema, 'undefined'], defaults, options);
}

/**
 * Partial.
 *
 * @param {Object} schema
 * @param {Object} defaults
 * @param {Object} options
 */

function partial(schema, defaults, options) {
  if (kindOf(schema) !== 'object') {
    if ("development" !== 'production') {
      throw new Error(`Partial structs must be defined as an object, but you passed: ${schema}`);
    } else {
      throw new Error(`Invalid schema: ${schema}`);
    }
  }

  const obj = scalar('object', undefined, options);
  const ks = [];
  const properties = {};

  for (const key in schema) {
    ks.push(key);
    const s = schema[key];
    const kind = any(s, undefined, options);
    properties[key] = kind;
  }

  const name = 'partial';
  const type = `{${ks.join()},...}`;
  const validate = (value = resolveDefaults(defaults)) => {
    const [error] = obj.validate(value);

    if (error) {
      error.type = type;
      return [error];
    }

    const errors = [];
    const ret = {};

    for (const key in properties) {
      let v = value[key];
      const kind = properties[key];

      if (v === undefined) {
        const d = defaults && defaults[key];
        v = resolveDefaults(d, value);
      }

      const [e, r] = kind.validate(v, value);

      if (e) {
        e.path = [key].concat(e.path);
        e.data = value;
        errors.push(e);
        continue;
      }

      if (key in value || r !== undefined) {
        ret[key] = r;
      }
    }

    if (errors.length) {
      const first = errors[0];
      first.errors = errors;
      return [first];
    }

    return [undefined, ret];
  };

  return new Kind(name, type, validate);
}

/**
 * Scalar.
 *
 * @param {String} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function scalar(schema, defaults, options) {
  if (kindOf(schema) !== 'string') {
    if ("development" !== 'production') {
      throw new Error(`Scalar structs must be defined as a string, but you passed: ${schema}`);
    } else {
      throw new Error(`Invalid schema: ${schema}`);
    }
  }

  const { types } = options;
  const fn = types[schema];

  if (kindOf(fn) !== 'function') {
    if ("development" !== 'production') {
      throw new Error(`No struct validator function found for type "${schema}".`);
    } else {
      throw new Error(`Invalid type: ${schema}`);
    }
  }

  const kind = func(fn, defaults, options);
  const name = 'scalar';
  const type = schema;
  const validate = value => {
    const [error, result] = kind.validate(value);

    if (error) {
      error.type = type;
      return [error];
    }

    return [undefined, result];
  };

  return new Kind(name, type, validate);
}

/**
 * Tuple.
 *
 * @param {Array} schema
 * @param {Array} defaults
 * @param {Object} options
 */

function tuple(schema, defaults, options) {
  if (kindOf(schema) !== 'array') {
    if ("development" !== 'production') {
      throw new Error(`Tuple structs must be defined as an array, but you passed: ${schema}`);
    } else {
      throw new Error(`Invalid schema: ${schema}`);
    }
  }

  const kinds = schema.map(s => any(s, undefined, options));
  const array = scalar('array', undefined, options);
  const name = 'tuple';
  const type = `[${kinds.map(k => k.type).join()}]`;
  const validate = (value = resolveDefaults(defaults)) => {
    const [error] = array.validate(value);

    if (error) {
      error.type = type;
      return [error];
    }

    const ret = [];
    const errors = [];
    const length = Math.max(value.length, kinds.length);

    for (let i = 0; i < length; i++) {
      const kind = kinds[i];
      const v = value[i];

      if (!kind) {
        const e = { data: value, path: [i], value: v };
        errors.push(e);
        continue;
      }

      const [e, r] = kind.validate(v);

      if (e) {
        e.path = [i].concat(e.path);
        e.data = value;
        errors.push(e);
        continue;
      }

      ret[i] = r;
    }

    if (errors.length) {
      const first = errors[0];
      first.errors = errors;
      return [first];
    }

    return [undefined, ret];
  };

  return new Kind(name, type, validate);
}

/**
 * Union.
 *
 * @param {Array} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function union(schema, defaults, options) {
  if (kindOf(schema) !== 'array') {
    if ("development" !== 'production') {
      throw new Error(`Union structs must be defined as an array, but you passed: ${schema}`);
    } else {
      throw new Error(`Invalid schema: ${schema}`);
    }
  }

  const kinds = schema.map(s => any(s, undefined, options));
  const name = 'union';
  const type = kinds.map(k => k.type).join(' | ');
  const validate = (value = resolveDefaults(defaults)) => {
    let error;

    for (const k of kinds) {
      const [e, r] = k.validate(value);
      if (!e) return [undefined, r];
      error = e;
    }

    error.type = type;
    return [error];
  };

  return new Kind(name, type, validate);
}

/**
 * Intersection.
 *
 * @param {Array} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function intersection(schema, defaults, options) {
  if (kindOf(schema) !== 'array') {
    if ("development" !== 'production') {
      throw new Error(`Intersection structs must be defined as an array, but you passed: ${schema}`);
    } else {
      throw new Error(`Invalid schema: ${schema}`);
    }
  }

  const types = schema.map(s => any(s, undefined, options));
  const name = 'intersection';
  const type = types.map(t => t.type).join(' & ');
  const validate = (value = resolveDefaults(defaults)) => {
    let v = value;

    for (const t of types) {
      const [e, r] = t.validate(v);

      if (e) {
        e.type = type;
        return [e];
      }

      v = r;
    }

    return [undefined, v];
  };

  return new Kind(name, type, validate);
}

/**
 * Kinds.
 *
 * @type {Object}
 */

const Kinds = {
  any,
  dict,
  enum: en,
  enums,
  function: func,
  instance,
  interface: inter,
  lazy,
  list,
  literal,
  object,
  optional,
  partial,
  scalar,
  tuple,
  union,
  intersection

  /**
   * Export.
   *
   * @type {Object}
   */

};

/**
 * The types that `kind-of` supports.
 *
 * @type {Array}
 */

const TYPES = ['arguments', 'array', 'boolean', 'buffer', 'date', 'error', 'float32array', 'float64array', 'function', 'generatorfunction', 'int16array', 'int32array', 'int8array', 'map', 'null', 'number', 'object', 'promise', 'regexp', 'set', 'string', 'symbol', 'uint16array', 'uint32array', 'uint8array', 'uint8clampedarray', 'undefined', 'weakmap', 'weakset'];

/**
 * The default types that Superstruct ships with.
 *
 * @type {Object}
 */

const Types = {
  any: value => value !== undefined
};

TYPES.forEach(type => {
  Types[type] = value => kindOf(value) === type;
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Create a struct factory with a `config`.
 *
 * @param {Object} config
 * @return {Function}
 */

function superstruct(config = {}) {
  const types = _extends({}, Types, config.types || {});

  /**
   * Create a `kind` struct with `schema`, `defaults` and `options`.
   *
   * @param {Any} schema
   * @param {Any} defaults
   * @param {Object} options
   * @return {Function}
   */

  function struct(schema, defaults$$1, options = {}) {
    if (isStruct(schema)) {
      schema = schema.schema;
    }

    const kind = Kinds.any(schema, defaults$$1, _extends({}, options, { types }));

    function Struct(data) {
      if (this instanceof Struct) {
        if ("development" !== 'production') {
          throw new Error('The `Struct` creation function should not be used with the `new` keyword.');
        } else {
          throw new Error('Invalid `new` keyword!');
        }
      }

      return Struct.assert(data);
    }

    Object.defineProperty(Struct, IS_STRUCT, { value: true });
    Object.defineProperty(Struct, KIND, { value: kind });

    Struct.kind = kind.name;
    Struct.type = kind.type;
    Struct.schema = schema;
    Struct.defaults = defaults$$1;
    Struct.options = options;

    Struct.assert = value => {
      const [error, result] = kind.validate(value);
      if (error) throw new StructError(error);
      return result;
    };

    Struct.test = value => {
      const [error] = kind.validate(value);
      return !error;
    };

    Struct.validate = value => {
      const [error, result] = kind.validate(value);
      if (error) return [new StructError(error)];
      return [undefined, result];
    };

    return Struct;
  }

  /**
   * Mix in a factory for each specific kind of struct.
   */

  Object.keys(Kinds).forEach(name => {
    const kind = Kinds[name];

    struct[name] = (schema, defaults$$1, options) => {
      const type = kind(schema, defaults$$1, _extends({}, options, { types }));
      const s = struct(type, defaults$$1, options);
      return s;
    };
  });

  /**
   * Return the struct factory.
   */

  return struct;
}

/**
 * Create a convenience `struct` factory for the default types.
 *
 * @type {Function}
 */

const struct = superstruct();

/* global fetch */
var templateRE = /{{([^}]+)?}}/;

function templateQuery() {
  var tpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var match = '';

  while (match = templateRE.exec(tpl)) {
    tpl = tpl.replace(match[0], data[match[1]]);
  }

  return tpl;
}

function stringify() {
  var Param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var payload = [];

  Object.keys(Param).forEach(function (key) {
    payload.push(key + '=' + Param[key]);
  });

  return payload.join('&');
}

function fireFetch(url, init) {
  return new Promise(function (resolve, reject) {
    fetch(url, init).then(function (res) {
      if (res.ok) {
        if (res.headers.get('content-type') && res.headers.get('content-type').includes('application/json')) {
          resolve(res.json());
        } else {
          resolve(res);
        }
      } else {
        reject(res);
      }
    }).catch(function (err) {
      reject(err);
    });
  });
}

var CONTENT_TYPE = {
  json: 'application/json; charset=UTF-8',
  formData: 'application/x-www-form-urlencoded; charset=UTF-8'
};

var headers = {};

function fire() {
  var queryParam = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var body = arguments[1];

  if (this.bodyStruct) {
    body = struct(this.bodyStruct, this.defaultBody || {})(body);
  }

  var url = templateQuery(this.path, queryParam);
  var init = {
    method: this.method,
    headers: Object.assign({ 'Content-Type': CONTENT_TYPE[this.contentType] || CONTENT_TYPE.json }, headers),
    mode: 'cors',
    cache: 'default'
  };

  if (body && init.headers['Content-Type'] === CONTENT_TYPE.json) {
    init.body = JSON.stringify(body);
  } else if (body && init.headers['Content-Type'] === CONTENT_TYPE.formData) {
    init.body = stringify(body);
  }

  return fireFetch(url, init);
}

function setHeaders(_headers) {
  headers = Object.assign(headers, _headers);
}

var main = {
  init: function init(config) {
    var api = {};

    config.list.forEach(function (item) {
      item.path = config.prefix + item.path;
      api[item.name] = item;
      api[item.name].fire = fire;
    });

    api.$setHeaders = setHeaders;

    return api;
  }
};

exports.default = main;
},{}],4:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  prefix: 'https://api.wellcloud.cc',
  list: [{
    name: 'login',
    desp: 'sercurity login',
    path: '/agent/login',
    method: 'post',
    contentType: 'formData',
    bodyStruct: {
      username: 'string',
      password: 'string',
      namespace: 'string'
    },
    defaultBody: {
      password: 'Aa123456'
    },
    status: {
      401: 'username or password wrong'
    }
  }, {
    name: 'heartBeat',
    desp: 'agent heart beat',
    path: '/sdk/api/csta/agent/heartbeat/{{agentId}}',
    method: 'post'
  }, {
    name: 'setAgentState',
    desp: 'set agent state',
    path: '/sdk/api/csta/agent/state',
    method: 'post',
    bodyStruct: {
      agentId: 'string?',
      loginId: 'string',
      func: 'string',
      agentMode: 'string?',
      device: 'string?',
      password: 'string'
    }
  }]
};
},{}],2:[function(require,module,exports) {
"use strict";

var _bundle = require("../dist/bundle.js");

var _bundle2 = _interopRequireDefault(_bundle);

var _apiConfig = require("./api.config.js");

var _apiConfig2 = _interopRequireDefault(_apiConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('---------');

const API = _bundle2.default.init(_apiConfig2.default);

console.log(API);

API.login.fire({}, {
  username: '5001',
  password: 'Aa123456',
  namespace: 'zhen04.cc'
}).then(res => {
  API.$setHeaders({
    sessionId: res.sessionId
  });

  return API.heartBeat.fire({
    agentId: '5001@zhen04.cc'
  });
}).then(() => {
  return API.setAgentState.fire({}, {
    'loginId': '5001@zhen04.cc',
    'device': '8001@zhen04.cc',
    'password': 'Aa123456',
    'agentMode': 'NotReady',
    'func': 'Login'
  });
}).catch(err => {
  console.error(err);
});
},{"../dist/bundle.js":3,"./api.config.js":4}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent) {
  var ws = new WebSocket('ws://localhost:59324/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      window.location.reload();
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error(`[parcel] 🚨 ${data.error.message}\n${data.error.stack}`);
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,2])