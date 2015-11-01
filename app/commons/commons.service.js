angular.module('commons', ['energimolnet'])
  .service('commonsService', function (emAuth) {
    var service = this;
    service.code = null;
  });