'use strict';

function main () {
  var _this = this;

  console.log('12345');

  var a = [];

  a.forEach(function (item) {
    console.log(_this.a);
    console.log(item);
  });
}

module.exports = main;
