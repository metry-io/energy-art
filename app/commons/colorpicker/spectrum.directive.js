'use strict';

/**
 * @ngdoc directive
 * @name energyArtApp.spectrum.directive
 * @description
 * # spectrum.directive
 * Factory in the energyArtApp.
 */

angular.module('energyArtApp')
  .directive('spectrumDirective', [function(){
    return {
      restrict: 'A',
      link: function(scope, ele, attr) {
        $(ele).spectrum(scope.$eval(attr.spectrumDirective));
      }
    };
  }]);

