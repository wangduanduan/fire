# :fire::fire: xfire :fire::fire:

![Travis](https://img.shields.io/travis/wangduanduan/xfire.svg)

[![npm](https://img.shields.io/npm/v/xfire.svg)](https://www.npmjs.org/package/xfire) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)]()
[![npm](https://img.shields.io/npm/dm/xfire.svg)]()



stupid simple, high configurable fetch api batch generate tool

---

# 特点
- 从配置文件中生成批量的接口

# 安装

```
yarn add xfire
```

# 例子

## 配置文件
```
// api.config.js

module.exports = {
  baseURL: 'http://localhost:3000',
  apis: [
    {
      name: 'login',
      url: '/login',
      method: 'post'
    },
    {
      name: 'getOneUser',
      url: '/users/{{id}}',
      method: 'get'
    }
  ]
}

```

## 使用方法
```
const xfire = require('xfire')
var apiConfig = require('./api.config.js')
var axios = require('axios')
var myApi = xfire(apiConfig, axios)

myApi.login.fire({}, {
  email: 'wdd@cc.tt',
  password: '000'
})
.then()
.catch()
```

# xfire 方法说明
```
const API = xfire(config, axios)
```

`config field`

NOTICE: if config not pass check, xfire will throw a Error 


名称 | 类型 | 是否必须 | defalut | description
---|---|---|---|---
config.baseURL | string | yes |  | common prefix: all apis are same
config.apis | array | yes |  | api array list 
config.timeout | number | no | 5000 | 请求超时时间
config.headers | object | no | {} | 请求头

`config list field descirption`

name | type | required | default | description
---|---|---|---|---
`name` | string | `yes` |  | api name
desp | string | no |  | api description
`url` | string | `yes` |  | api path
method | enum string | no | get | methods : get, post, put, delete 
contentType | string | no | application/json; charset=UTF-8 | 请求体类型。

## $setCommonHeader(key, value): 设置请求头

```
API.$setCommonHeader({sessionId: 'jfsldkf-sdflskdjf-sflskfjlsf'})
```

## fire(pathParm, body)

pathParm 会以mustache的语法将相应变量被渲染到路径中。

如果路径中需要的变量，pathParm中没有，那么该变相就会被渲染为undefined。

xfire仅支持最简单的key/value渲染。

```
{
  name: 'heartBeat',
  desp: 'agent heart beat',
  url: '/sdk/api/csta/agent/heartbeat/{{agentId}}',
  method: 'post'
}

// 该请求。路径最终会被渲染成/sdk/api/csta/agent/heartbeat/1234

myApi.heartBeat.fire({agentId: '1234'})
.then()
.catch()
```



