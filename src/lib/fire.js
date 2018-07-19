import * as util from '../util/index.js'
import CONTENT_TYPE from '../const/content-type.js'
import assign from 'lodash/assign'
import axios from 'axios'

var headers = {}

export function fire (queryParam = {}, body) {
  let url = util.templateQuery(this.path, queryParam)
  let init = {
    url: url,
    method: this.method,
    headers: assign({'Content-Type': CONTENT_TYPE[this.contentType] || CONTENT_TYPE.json}, headers)
  }

  if (body) {
    init.data = body
  }
  if (body && init.headers['Content-Type'] === CONTENT_TYPE.formData) {
    init.data = util.stringify(body)
  }

  return axios(init)
}

export function setHeaders (_headers) {
  headers = assign(headers, _headers)
}
