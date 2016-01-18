'use strict';

describe('Service: dataservice', function () {

  // load the controller's module
  beforeEach(module('energyArtApp'));

  // instantiate service
  var dataService,
      httpBackend;
  beforeEach(inject(function (_dataservice_, $httpBackend) {
    dataService = _dataservice_;
    httpBackend = $httpBackend;
  }));

  it('Should do something', function () {
    expect(!!dataService).toBe(true);
  });

});
