'use strict';

/**
 * @ngdoc directive
 * @name energyArtApp.hexagon.directive
 * @description
 * # hexagon.directive
 * Factory in the energyArtApp.
 */

angular.module('energyArtApp')
  .directive('heatmap', ['d3Service', 'dataservice', 'visService', function (d3Service, dataservice, visService) {
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

          if( days !== undefined){
            d3Service.d3().then(function (d3) {

              var width,
                height;

              var vis = d3.select(ele[0])
                .append("svg");

              var color = d3.scale.linear()
                .clamp(true)
                .domain([0, scope.max])
                .range(["hsl(235, 70%, 0%)", "hsl(235, 70%, 95%)"]);

              window.onresize = function () {
                scope.$apply();
              };

              // Watch for resize event
              scope.$watch(function () {
                return angular.element(window)[0].innerWidth;
              }, function () {
                width = angular.element(window)[0].innerWidth;
                height = angular.element(window)[0].innerHeight * 0.60;

                // Make sure that the element i cleaned from svg's
                d3.select(ele[0]).selectAll("svg").remove();
                vis = d3.select(ele[0])
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);
                if(days !== undefined ) scope.render(days);
              });

              scope.render = function (days) {
                days.forEach(function (data, day) {
                  data.forEach(function (value, hour) {

                    var rectWidth = width / 300,
                      rectHeight = height / 24;

                    vis.append("rect")
                      .attr("x", day * rectWidth)
                      .attr("y", hour * rectHeight)
                      .attr("width", rectWidth)
                      .attr("height", rectHeight)
                      .attr("fill", color(value))
                      .append("title")
                      .text(function () {
                        return value + " kWh";
                      });
                  });
                });

              };
            });
          }

        })
      }
    };
  }]);

