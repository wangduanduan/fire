# :fire::fire: xfire :fire::fire:

[![npm](https://img.shields.io/npm/v/xfire.svg)](https://www.npmjs.org/package/xfire) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)]()
[![npm](https://img.shields.io/npm/dm/xfire.svg)]()

stupid simple, high configurable fetch api batch generate tool

---

# Features
- :smile: configurable: give config file, get fetch api
- :triangular_ruler:  pre-verify body: pre verify fetch body before send 
- :bug: detail error: detailed error informations

# Installing
```
npm install -S xfire

yarn add xfire
```

# Example

first, xfire need a config file
```
// api.config.js

export default {
  prefix: 'http://localhost:80',
  list: [
    {
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
    },
    {
      name: 'heartBeat',
      path: '/sdk/api/csta/agent/heartbeat/{{agentId}}',
    },
    {
      name: 'setAgentState',
      desp: 'set agent state',
      path: '/sdk/api/csta/agent/state/{{namespace}}',
      method: 'post',
      bodyStruct: {
        agentId: 'string?',
        loginId: 'string',
        func: 'string',
        agentMode: 'string?',
        device: 'string?',
        password: 'string'
      }
    }
  ]
}
```

import xfire
```
import xfire from 'xfire'
import apiConfig from './api.config.js'

const API = xfire.init(apiConfig)
```

> POST send formData example
```
API.login.fire({}, {
  username: 'wangduanduan',
  password: '123456',
  namespace: 'dd.com'
})
.then((res) => {
  console.log(res)
})
.catch((err) => {
  console.log(err)
})
```

> GET emample
```
API.heartBeat.fire({
  agentId: '5001@dd.com'
})
.then((res) => {
  console.log(res)
})
.catch((err) => {
  console.log(err)
})
```

> POST json body example
```
API.setAgentState.fire({
  namespace: 'windows'
}, {
  agentId: '5001@dd.com',
  loginId: '5001@dd.com',
  func: 'login',
  agentMode: 'Ready',
  device: '8001@dd.com',
  password: '123456'
})
.then((res) => {
  console.log(res)
})
.catch((err) => {
  console.log(err)
})
```

# xfire API
```
const API = xfire.init(config)
```

`config field`

NOTICE: if config not pass check, xfire will throw a Error 


name | type | required | defalut | description
---|---|---|---|---
config.prefix | string | yes |  | common prefix: all apis are same
config.list | array | yes |  | api array list 

`config list field descirption`

name | type | required | default | description
---|---|---|---|---
`name` | string | `yes` |  | api name
desp | string | no |  | api description
`path` | string | `yes` |  | api path
method | enum string | no | get | methods : get, post, put, delete 
contentType | enum string | no | json | 'json' or 'formData'。json equal : application/json; charset=UTF-8, formData equal : application/x-www-form-urlencoded; charset=UTF-8
bodyStruct | object | no |  | reqest body struct for check, you can see [superstruct](https://github.com/ianstormtaylor/superstruct/blob/master/docs/guide.md)
defaultBody | object | no |  | defalut body。it require bodyStruct exist 
status | object | no | | status and reason

when list name no exist, config check throw error:
```
Uncaught StructError: Expected a value of type `string` for `name` but received `undefined`.
```

before send fetch, bodyStruct check failed, throw error
```
...
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
...

API.login.fire({}, {
  // username: '5001',
  password: 'Aa123456',
  namespace: 'zhen04.cc'
})

Uncaught StructError: Expected a value of type `string` for `username` but received `undefined`.
```

# xfire Instance API
xfire.init() will return xfire Instance, it has a special method `$setHeaders`, and other fetch methods

```
const API = xfire.init(apiConfig)
```
## $setHeaders(): set fetch headers

$setHeaders() is used to setting headers besides `contentType`.  once set headers, all fetch apis will with the same headers. 
```
API.$setHeaders({sessionId: 'jfsldkf-sdflskdjf-sflskfjlsf'})
```

## fetch api methods: fire(pathParm, body)
pathParm will be render to `path`, body is the payload。

```
...
    {
      name: 'heartBeat',
      desp: 'agent heart beat',
      path: '/sdk/api/csta/agent/heartbeat/{{agentId}}',
      method: 'post'
    },
...
```

like up config, will generate a fetch Object name `heartBeat`, it has a fetch method named fire

```
API.xxx.fire(pathParm, body)

// body sometimes is optional
API.xxx.fire(pathParm)

// but pathParam is requred, or you can just put a empty {}
API.xxx.fire({}, body)
```

demo: 
```
API.heartBeat({
  agentId: '5001@ee.com'
})
.then((res) => {
  console.log(res)
})
.catch((err) => {
  console.log(err)
})
```

aboudt `path` and `fire` `pathParm`:
```
// path 
path: '/store/order/{{type}}/{{age}}'

// pathParm, it look like mustache grammar
{
  type: 'dog',
  aget: 14
}
```

`notice`: pathParm can't be a complicated object

```
// string, number, boolean are ok
{
  key1: 'string',
  key2: number,
  key3: boolean
}

// array, object, funtion will be failed
// bad
{
  key1: [1, 3, 3],
  key2: {
    key3: 'string'
  },
  key4: function(){}
}
```

# :warning: polyfill
xfire use browser native `Promise`, `fetch`, `Object.keys()`, `Object.assign()`  and `xfire is without any polyfill。` so, you maybe need some polyfill to help xfire work on some old browser like IE11。 i give you two ways.

## a: babel-polyfill
just requre [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)

## b: [polyfill.io](https://polyfill.io/v2/docs/)

![](./static/polyfill-io.png)

Just the polyfills you need for your site, tailored to each browser. Copy the code to unleash the magic:

```
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
```

Polyfill.io reads the User-Agent header of each request and returns polyfills that are suitable for the requesting browser. Tailor the response based on the features you're using in your app, and see our live examples to get started quickly.



