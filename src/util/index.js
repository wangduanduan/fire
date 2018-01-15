/* global fetch */
import { struct } from 'superstruct'
import CONFIG_STRUCT from '../const/config-struct.js'
const templateRE = /{{([^}]+)?}}/

export function templateQuery (tpl = '', data = {}) {
  var match = ''

  while ((match = templateRE.exec(tpl))) {
    tpl = tpl.replace(match[0], data[match[1]])
  }

  return tpl
}

export function stringify (Param = {}) {
  var payload = []

  Object.keys(Param).forEach((key) => {
    payload.push(`${key}=${Param[key]}`)
  })

  return payload.join('&')
}

export function fireFetch (url, init) {
  return new Promise((resolve, reject) => {
    fetch(url, init)
    .then((res) => {
      if (res.ok) {
        if (res.headers.get('content-type') && res.headers.get('content-type').includes('application/json')) {
          resolve(res.json())
        } else {
          resolve(res)
        }
      } else {
        reject(res)
      }
    })
    .catch((err) => {
      reject(err)
    })
  })
}

export function checkConfig (config) {
  struct(CONFIG_STRUCT.config)(config)

  config.list.forEach((item) => {
    item = struct(CONFIG_STRUCT.item, CONFIG_STRUCT.defaultItem)(item)
  })
}
