'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var keys = _interopDefault(require('lodash/keys'));
var axios = _interopDefault(require('axios'));
var assign = _interopDefault(require('lodash/assign'));

// import {keys} from 'lodash'
const templateRE = /{{([^}]+)?}}/;

function templateQuery (tpl = '', data = {}) {
  var match = '';

  while ((match = templateRE.exec(tpl))) {
    tpl = tpl.replace(match[0], data[match[1]]);
  }

  return tpl
}

function stringify (Param = {}) {
  var payload = [];

  keys(Param).forEach((key) => {
    payload.push(`${key}=${Param[key]}`);
  });

  return payload.join('&')
}

var CONTENT_TYPE = {
  json: 'application/json; charset=UTF-8',
  formData: 'application/x-www-form-urlencoded; charset=UTF-8'
}

var headers = {};

function fire (queryParam = {}, body) {
  let url = templateQuery(this.path, queryParam);
  let init = {
    url: url,
    method: this.method,
    headers: assign({'Content-Type': CONTENT_TYPE[this.contentType] || CONTENT_TYPE.json}, headers)
  };

  if (body) {
    init.data = body;
  }
  if (body && init.headers['Content-Type'] === CONTENT_TYPE.formData) {
    init.data = stringify(body);
  }

  return axios(init)
}

function setHeaders (_headers) {
  headers = assign(headers, _headers);
}

var main = {
  init (config) {
    var api = {};

    config.list.forEach((item) => {
      item.path = config.prefix + item.path;
      api[item.name] = item;
      api[item.name].fire = fire;
    });

    api.$setHeaders = setHeaders;

    return api
  }
}

module.exports = main;
