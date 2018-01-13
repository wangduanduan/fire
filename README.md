# xfire
可配置的fetch接口生成工具

# 特点
- 非常简单:提供配置文件,自动生成接口
- 提前验证:支持请求体格式验证
- 报错详细:给出具体的报错位置,字段信息

# 浏览器支持

xfire使用了一些es6的方法:
- Object.keys()
- Object.assign()
- Promise()
- fetch()

# 安装
```
npm install -S xfire

yarn add xfire
```

# demo

首先需要一个配置文件
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

然后引入xfire
```
import xfire from 'xfire'
import apiConfig from './api.config.js'

const API = xfire.init(apiConfig)
```

> POTST 发送formData类型的数据示例
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

> GET 数据示例
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

> POST json类型数据示例
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

`config 字段说明`

注意:如果config无法通过下面的格式验证,则会直接报错


字段名 | 类型 | 是否必须 | 默认值 | 说明
---|---|---|---|---
config.prefix | string | 是 | 无 | 接口url公用的前缀
config.list | array | 是 | 无 | 接口数组

`config list字段说明`
字段名 | 类型 | 是否必须 | 默认值 | 说明
---|---|---|---|---
`name` | string | `是` | 无 | 接口名
desp | string | 否 | 无 | 接口描述
`path` | string | `是` | 无 | 接口路径
method | enum string | 否 | get | 请求方式: get, post, put, delete 
contentType | enum string | 否 | json | 请求体类型: json, formData。json会被渲染: application/json; charset=UTF-8, formData会被渲染成: application/x-www-form-urlencoded; charset=UTF-8
bodyStruct | object | 否 | 无 | 请求体格式验证结构, 如果bodyStruct存在,则使用bodyStruct验证body: 具体格式参考[superstruct](https://github.com/ianstormtaylor/superstruct/blob/master/docs/guide.md)
defaultBody | object | 否 | 无 | 默认请求体。bodyStruct存在的情况下才有效
status | object | 否 | 无 | 响应状态码及其含义

当某个list对象的 name 不存在时,config验证时的报错:
```
Uncaught StructError: Expected a value of type `string` for `name` but received `undefined`.
```

当发送请求时,请求体不符合bodyStruct时, 报错如下
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



# xfire 实例 API
xfire.init()方法会返回xfire实例对象,该对象上有一个特殊方法`$setHeaders`, 还有其他的由配置文件产生的方法。

```
const API = xfire.init(apiConfig)
```
## $setHeaders(): 设置请求头部信息

$setHeaders()用来设置除了`contentType`以外的请求头, 一旦设置请求头部信息,所有的实例接口在发送请求时,都会带有该头部信息。
```
API.$setHeaders({sessionId: 'jfsldkf-sdflskdjf-sflskfjlsf'})
```

## api方法: fire(pathParm, body)
pathParm对象上的数据最终会被渲染到`请求路径上`, body是请求体。

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

类似上面的对象,会产生一个以`heartBeat`为名称的方法,所有请求方法都是fire()方法。

```
API.xxx.fire(pathParm, body)

// 不需要请求体时, body可以不传
API.xxx.fire(pathParm)

// 不需要参数渲染到路径时,pathParm必须传空对象:{}
API.xxx.fire({}, body)
```

例子: 
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

关于`path`和 fire的 `pathParm`参数:
```
// path 如下
path: '/store/order/{{type}}/{{age}}'

// 则pathParm应该是
{
  type: 'dog',
  aget: 14
}
```

`注意`: pathParm不支持复杂的数据类型。

```
// 原始数据类型 string, number, boolean 都是可以的
{
  key1: 'string',
  key2: number,
  key3: boolean
}

// 复杂的数据类型,如数组和嵌套对象,函数,将导致渲染失败
// bad
{
  key1: [1, 3, 3],
  key2: {
    key3: 'string'
  },
  key4: function(){}
}
```

# polyfill
xfire底层使用了浏览器原生的`Promise`, `fetch`, `Object.keys()`, `Object.assign()` 所以对浏览器是有要求的。`xfire本身不带有任何polyfill。`

目前IE11以及以下是不支持Promise和fetch的。

在此给出两个方案:

## 方案1: babel-polyfill

通过引入[babel-polyfill](https://babeljs.io/docs/usage/polyfill/), 让浏览器支持xfire所需要的原生方法。

## 方案2: [polyfill.io](https://polyfill.io/v2/docs/)

![](./static/polyfill-io.png)

只需要为您的网站,为每个浏览器量身定制的polyfills。 复制代码释放魔法:

```
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
```

Polyfill.io读取每个请求的User-Agent头并返回适合请求浏览器的polyfill。 根据您在应用中使用的功能量身定制响应,并查看我们的实例以快速入门。