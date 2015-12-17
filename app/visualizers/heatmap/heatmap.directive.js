'use strict';

/**
 * @ngdoc directive
 * @name energyArtApp.hexagon.directive
 * @description
 * # hexagon.directive
 * Factory in the energyArtApp.
 */

angular.module('energyArtApp')
  .directive('radialChart', ['d3Service', 'dataservice', 'visService', function (d3Service, dataservice, visService) {
    // Runs during compile
    return {
      scope: {
        startDate: '=',
        endDate: '='
      },
      restrict: 'E',
      link: function (scope, ele, attr) {

        var startDate = new Date(attr.startDate),
          endDate = new Date(attr.endDate);

        dataservice.getMeterDayData(visService.meter, startDate, endDate).then(function (d) {
          scope.days = d;
        });

        dataservice.getMaxHourValue(visService.meter).then(function(d) {
          scope.max = d;
        });

        scope.$watch('days', function (days) {

          d3Service.d3().then(function (d3) {

            var color = d3.scale.linear()
              .clamp(true)
              .domain([0, scope.max])
              .range(["hsl(235, 70%, 30%)", "hsl(235, 70%, 95%)"]);

            window.onresize = function () {
              scope.$apply();
            };

            // Watch for resize event
            scope.$watch(function () {
              return angular.element(window)[0].innerWidth;
            }, function () {
              if(days !== undefined ) scope.render(days);
            });

            scope.render = function (days) {
            };
          });
        })
      }
    };
  }]);

