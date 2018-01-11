'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/* global fetch */
var templateRE = /{{([^}]+)?}}/;

function templateQuery() {
  var tpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var match = '';

  while (match = templateRE.exec(tpl)) {
    tpl = tpl.replace(match[0], data[match[1]]);
  }

  return tpl;
}

function stringify() {
  var Param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var payload = [];

  Object.keys(Param).forEach(function (key) {
    payload.push(key + '=' + Param[key]);
  });

  return payload.join('&');
}

function fireFetch(url, init) {
  return new Promise(function (resolve, reject) {
    fetch(url, init).then(function (res) {
      if (res.ok) {
        if (res.headers.get('content-type').includes('application/json')) {
          resolve(res.json());
        } else {
          resolve(res);
        }
      } else {
        reject(res);
      }
    }).catch(function (err) {
      reject(err);
    });
  });
}

var CONTENT_TYPE = {
  json: 'application/json; charset=UTF-8',
  formData: 'application/x-www-form-urlencoded; charset=UTF-8'
};

var headers = {};

function fire() {
  var queryParam = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var body = arguments[1];

  var url = templateQuery(this.path, queryParam);
  var init = {
    method: this.method,
    headers: Object.assign({ 'Content-Type': this.contentType || CONTENT_TYPE.json }, headers),
    mode: 'cors',
    cache: 'default'
  };

  if (body && init.headers['Content-Type'] === CONTENT_TYPE.json) {
    init.body = JSON.stringify(body);
  } else if (body && init.headers['Content-Type'] === CONTENT_TYPE.formData) {
    init.body = stringify(body);
  }

  return fireFetch(url, init);
}

function setHeaders$1(_headers) {
  headers = Object.assign(headers, _headers);
}

function init(config) {
  var api = {};

  config.list.forEach(function (item) {
    item.path = config.prefix + item.path;
    api[item.name] = item;
    api[item.name].fire = fire;
  });

  return api;
}

function setHeaders(head) {
  setHeaders$1(head);
}

exports.init = init;
exports.setHeaders = setHeaders;
