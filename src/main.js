import {
  templateQuery
} from './util.js'
import CONTENT_TYPE from './content-type.js'

function fireAxios (queryParam = {}, body) {
  let url = templateQuery(this.url, queryParam)
  let config = {
    url: url,
    method: this.method,
    headers: {
      'Content-Type': this.contentType || CONTENT_TYPE.json
    }
  }

  if (body) {
    config.data = body
  }

  return this.$http(config)
}

function connectAxios (config, axios) {
  const api = {}

  const instance = axios.create({
    baseURL: config.baseURL || '',
    timeout: config.timeout || 5000,
    headers: config.headers || {}
  })

  config.apis.forEach((item) => {
    api[item.name] = item
    api[item.name].fire = fireAxios
    api[item.name].$http = instance
  })

  api.$setCommonHeader = (key, value) => {
    instance.defaults.headers.common[key] = value
  }

  return api
}

function connectJQuery () {}

function checkConfig (config) {
  if (!config.baseURL) {
    throw new Error('config.baseURL not exist')
  }
  if (!config.apis || config.apis.length === 0) {
    throw new Error('config.apis not exist or apis length === 0')
  }
  config.apis.forEach((item) => {
    if (!item.name || !item.url) {
      throw new Error('item.name or item.url not exist')
    }
  })
}

export default function (config, httpClient) {
  checkConfig(config)
  if (httpClient.Axios) {
    return connectAxios(config, httpClient)
  }
  if (httpClient.ajax) {
    return connectJQuery()
  }
  throw new Error('axios or jquery not exist')
}
