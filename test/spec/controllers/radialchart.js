'use strict';

describe('Controller: RadialchartCtrl', function () {

  // load the controller's module
  beforeEach(module('energyArtApp'));

  var RadialchartCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RadialchartCtrl = $controller('RadialchartCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RadialchartCtrl.awesomeThings.length).toBe(3);
  });
});
