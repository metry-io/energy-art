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
      restrict: 'E',
      link: function (scope, ele) {

        console.log('Heatmap');
        visService.init(scope, renderVis);

        function renderVis(){
              d3Service.d3().then(function (d3) {

                console.log("new data");

                var width = angular.element(window)[0].innerWidth,
                  height = angular.element(window)[0].innerHeight;

                // Make sure that the element i cleaned from svg's
                d3.select(ele[0]).selectAll("svg").remove();

                var vis = d3.select(ele[0])
                  .append("svg")
                  .attr("width", "100%")
                  .attr("height", "100%");

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
                    width = angular.element(window)[0].innerWidth;
                    height = angular.element(window)[0].innerHeight;

                  scope.render(scope.days);
                });

                scope.render = function (days) {

                  var rectWidth = width / scope.numDays,
                    rectHeight = height / 24,
                    xOffset = 60;

                  vis.attr("transform", function (d, i) {
                      return "translate(" + (Math.floor(i/24) * rectWidth + xOffset) + ",0)";});

                  // Only animate if we have new data
                  if (scope.newData) {
                    vis.selectAll("rect")
                      .data(days)
                      .enter()
                      .append("rect")
                      .attr("class", "enter")
                      .attr("opacity", 0)
                      .transition().ease("linear")
                      .delay(function (d, i) {
                        var hour = Math.floor(i / 24);
                        return hour * 20;
                      })
                      .duration(750)
                      .attr("opacity", 1)
                      .attr("y", function (d, i) {
                        var hour = i % 24;
                        return hour * rectHeight;
                      })
                      .attr("x", function (d, i) {
                        var day = Math.floor(i / 24);
                        return day * rectWidth;
                      })
                      .attr("width", rectWidth)
                      .attr("height", rectHeight)
                      .attr("fill", function (d) {
                        return d.value == null ? 0 : color(d.value);
                      });
                  }

                  else {
                    vis.selectAll("rect")
                      .data(days)
                      .enter()
                      .append("rect")
                      .attr("y", function (d, i) {
                        var hour = i % 24;
                        return hour * rectHeight;
                      })
                      .attr("x", function (d, i) {
                        var day = Math.floor(i / 24);
                        return day * rectWidth;
                      })
                      .attr("width", rectWidth)
                      .attr("height", rectHeight)
                      .attr("fill", function (d) {
                        return d.value == null ? 0 : color(d.value);
                      })
                      .append("title")
                      .text(function (d) {
                        return d.value + " kWh";
                      });
                  }

                };
              });
            }
        }
    };
  }]);
