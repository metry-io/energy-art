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
      restrict: 'E',
      link: function (scope, ele) {

        visService.init(scope, renderVis);

        // Handles everything that concerns the rendering
        function renderVis() {
            d3Service.d3().then(function (d3) {

              var width = angular.element(window)[0].innerWidth,
                height = angular.element(window)[0].innerHeight;

              // Make sure that the element i cleaned from svg's
              d3.select(ele[0]).selectAll("svg").remove();

              var vis = d3.select(ele[0])
                .append("svg")
                .attr("width", width)
                .attr("height", height);

              var arc = d3.svg.arc();

              var valueScale = d3.scale.linear()
                .domain([0, scope.max])
                .range([0, 10]);

              var color = d3.scale.linear()
                .clamp(true)
                .domain([0, scope.max])
                .range([scope.startColor, scope.endColor]);

              window.onresize = function () {
                scope.$apply();
              };

              // Watch for resize event
              scope.$watch(function () {
                return angular.element(window)[0].innerWidth;
              }, function () {
                if (scope.days !== undefined) scope.render(scope.days);
              });

              scope.render = function (days) {
                vis.selectAll("*").remove();

                // it is recommended to use d3's each function for this but it was not as straightforward as one would
                // hoped it would be to use that method. But try at least to use it on the data variable
                days.forEach(function (data, day) {
                  data.forEach(function (value, hour) {
                    var ir = hour * 10,
                      or = ir + valueScale(value),
                      sa = 2 * Math.PI * ((day - 1) / scope.numDays),
                      ea = 2 * Math.PI * (day / scope.numDays),
                      scale = 1.5;

                    arc.innerRadius(ir * scale)
                      .outerRadius(or * scale)
                      .startAngle(sa)
                      .endAngle(ea);

                    vis.append("path")
                      .attr("d", arc)
                      .attr("fill", color(value))
                      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                      .append("title")
                      .text(function () {
                        return value + " kWh";
                      });

                    /*
                     MAKE INFO OPTIONAL
                     vis.append("text")
                     .attr("text-anchor", "middle")
                     .attr("font-size", "36px")
                     .attr("font-weight", "800")
                     .attr("fill", "#A4A4A4")
                     .attr("transform", "translate(500 , 40)")
                     .text(startDate.toDateString());

                     vis.append("text")
                     .attr("text-anchor", "middle")
                     .attr("font-size", "36px")
                     .attr("font-weight", "800")
                     .attr("fill", "#A4A4A4")
                     .attr("transform", "translate(1300 , 40)")
                     .text(endDate.toDateString());


                     */
                  })
                });
              };
            });
        }
      }
    };
  }]);

