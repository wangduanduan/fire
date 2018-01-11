import * as util from '@/util/index.js'
import CONTENT_TYPE from '@/const/content-type.js'

var headers = {}

export function fire (queryParam = {}, body) {
  let url = util.templateQuery(this.path, queryParam)
  let init = {
    method: this.method,
    headers: Object.assign({'Content-Type': this.contentType || CONTENT_TYPE.json}, headers),
    mode: 'cors',
    cache: 'default'
  }

  if (body && init.headers['Content-Type'] === CONTENT_TYPE.json) {
    init.body = JSON.stringify(body)
  } else if (body && init.headers['Content-Type'] === CONTENT_TYPE.formData) {
    init.body = util.stringify(body)
  }

  return util.fireFetch(url, init)
}

export function setHeaders (_headers) {
  headers = Object.assign(headers, _headers)
}
