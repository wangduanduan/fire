import { struct } from 'superstruct'
import CONTENT_TYPE from './content-type.js'
import HTTP_METHOD from './http-method.js'

export default {
  config: {
    prefix: 'string',
    list: 'array'
  },
  item: {
    name: 'string',
    desp: 'string?',
    path: 'string',
    method: struct.enum(HTTP_METHOD.concat(undefined)),
    contentType: struct.enum(Object.keys(CONTENT_TYPE).concat(undefined)),
    bodyStruct: 'object?',
    defaultBody: 'object?',
    status: 'object?'
  },
  itemDefault: {
    method: 'get',
    contentType: CONTENT_TYPE.json
  }
}
