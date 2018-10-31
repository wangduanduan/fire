(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.xfire = factory());
}(this, (function () { 'use strict';

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

var CONTENT_TYPE = {
  json: 'application/json; charset=UTF-8',
  formData: 'application/x-www-form-urlencoded; charset=UTF-8'
};

function fireAxios() {
  var queryParam = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var body = arguments[1];

  var url = templateQuery(this.url, queryParam);
  var config = {
    url: url,
    method: this.method,
    headers: {
      'Content-Type': this.contentType || CONTENT_TYPE.json
    }
  };

  if (body) {
    config.data = body;
  }

  return this.$http(config);
}

function connectAxios(config, axios) {
  var api = {};

  var instance = axios.create({
    baseURL: config.baseURL || '',
    timeout: config.timeout || 5000,
    headers: config.headers || {}
  });

  config.apis.forEach(function (item) {
    api[item.name] = item;
    api[item.name].fire = fireAxios;
    api[item.name].$http = instance;
  });

  api.$setCommonHeader = function (key, value) {
    instance.defaults.headers.common[key] = value;
  };

  return api;
}

function connectJQuery() {}

function checkConfig(config) {
  if (!config.baseURL) {
    throw new Error('config.baseURL not exist');
  }
  if (!config.apis || config.apis.length === 0) {
    throw new Error('config.apis not exist or apis length === 0');
  }
  config.apis.forEach(function (item) {
    if (!item.name || !item.url) {
      throw new Error('item.name or item.url not exist');
    }
  });
}

function main (config, httpClient) {
  checkConfig(config);
  if (httpClient.Axios) {
    return connectAxios(config, httpClient);
  }
  if (httpClient.ajax) {
    return connectJQuery();
  }
  throw new Error('axios or jquery not exist');
}

return main;

})));
