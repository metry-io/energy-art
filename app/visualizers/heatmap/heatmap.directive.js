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

                var width = 0,
                  height = 0;

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
                  width = vis.node().getBoundingClientRect().width;
                  height = vis.node().getBoundingClientRect().height;

                  scope.render(scope.days);
                });

                scope.render = function (days) {
                  // Make sure that the element i cleaned from svg's
                  d3.select(ele[0]).selectAll("svg").remove();

                  vis = d3.select(ele[0])
                    .append("svg")
                    .attr("width", "100%")
                    .attr("height", "100%");

                  var rectWidth = width / scope.numDays,
                    rectHeight = height / 24,
                    xOffset = 60;

                  var heatmap = vis.selectAll("g")
                    .data(days, function (d) {
                      return d;
                    });

                  heatmap.enter().append("g")
                    .attr("transform", function (data, day) {
                      return "translate(" + (day * rectWidth + xOffset) + ",0)";
                    })
                    .each(function (data) {
                      var col = d3.select(this).selectAll("rect")
                        .data(data);

                      // Only animate if we have new data
                      if (scope.newData) {
                        col.enter()
                          .append("rect")
                          .attr("class", "enter")
                          .attr("opacity", 0)
                          .transition().ease("linear")
                          .delay(function (d, i) {
                            return i * 400;
                          })
                          .duration(750)
                          .attr("opacity", 1)
                          .attr("y", function (d, i) {
                            return i * rectHeight;
                          })
                          .attr("width", rectWidth)
                          .attr("height", rectHeight)
                          .attr("fill", function (value) {
                            return value == null ? 0 : color(value);
                          });
                      }

                      else {
                        col.enter()
                          .append("rect")
                          .attr("y", function (d, i) {
                            return i * rectHeight;
                          })
                          .attr("width", rectWidth)
                          .attr("height", rectHeight)
                          .attr("fill", function (value) {
                            return value == null ? 0 : color(value);
                          })
                          .append("title")
                          .text(function (value) {
                            return value + " kWh";
                          });
                      }
                    });
                };
              });
            }
        }
    };
  }]);
