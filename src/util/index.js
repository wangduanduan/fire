import keys from 'lodash/keys'
// import {keys} from 'lodash'
import axios from 'axios'

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

  keys(Param).forEach((key) => {
    payload.push(`${key}=${Param[key]}`)
  })

  return payload.join('&')
}

export function fireFetch (url, init) {
  return axios(init)
}

export function checkConfig (config) {

}
