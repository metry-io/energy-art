'use strict';

/**
 * @ngdoc function
 * @name energyArtApp.controller:RadialchartCtrl
 * @description
 * # RadialchartCtrl
 * Controller of the energyArtApp
 */
angular.module('energyArtApp')
  .controller('HeatmapCtrl', function (data, maxValue) {
    var vm = this;
    vm.days = data;
    vm.maxValue = maxValue;
    vm.getColor = getColor;

    //////////////////////////////////////////////////////////////////

    function getColor(hourValue) {
      var max = vm.maxValue || 100;
      return 'hsl(173, 100%, ' + ((hourValue / max) * 75) + '%)';
    }
    
  });
