'use strict';

/**
 * @ngdoc function
 * @name energyArtApp.controller:RadialchartCtrl
 * @description
 * # RadialchartCtrl
 * Controller of the energyArtApp
 */
angular.module('energyArtApp')
  .controller('RadialchartCtrl', function (data, maxValue) {
    var vm = this;
    vm.days = data;
    vm.maxValue = maxValue;

    vm.getColor = getColor;
    vm.getStroke = getStroke;
    vm.getPath = getPath;
    
    //////////////////////////////////////////////////////////////////

    function getColor(hourValue) {
      var max = vm.maxValue || 100;
      return 'hsl(173, 100%, ' + ((hourValue / max) * 75) + '%)';
    }

    function getStroke(hourValue) {
      var max = vm.maxValue || 100;
      return (hourValue / max) * 50;
    }

    function getPath(day, hour, radius, hourValue){
      var r;
      var max = vm.maxValue || 100;

      var offset = 5;
      var strokeOffset = ((hourValue/ max) * 50)/2;
      var hourOffset = (radius * (hour/24));
      var prevMaxHeight = (max * 50 + radius * ((hour-1)/24)) || 0;
      r =   hourOffset + strokeOffset + prevMaxHeight + offset;

      var ax = radius + (r * Math.cos(2*Math.PI * ((day-1)/365)))
      var ay = (r * Math.sin(2*Math.PI * ((day-1)/365)))
      var bx = radius + (r * Math.cos(2*Math.PI * (day/365)))
      var by = (r * Math.sin(2*Math.PI * (day/365)))
    
      return 'M' + ax + ',' + ay + ' A' + radius + ',' + radius + ' 0 0,0 ' + bx + ',' + by
    }

  });
