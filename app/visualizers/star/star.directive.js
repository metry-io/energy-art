'use strict';

/**
 * @ngdoc directive
 * @name energyArtApp.star.directive
 * @description
 * # star.directive
 *
 */

angular.module('energyArtApp')
  .directive('star', ['d3Service', 'dataservice', 'visService', 'twitterShareService', function (d3Service, dataservice, visService, ts) {
    return {
      restrict: 'E',
      link: function (scope, ele) {

        visService.init(scope, renderVis);

        var config = {
          scale: 40
        };

        function renderVis() {
          d3Service.d3().then(function (d3) {

            var width = visService.getWidth(),
              height = visService.getHeight();

            // Make sure that the element i cleaned from svg's
            d3.select(ele[0]).selectAll("svg").remove();

            var vis = d3.select(ele[0])
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .attr("id", "visualization");

            var tooltip = d3.select("tooltip");

            var valueScale = d3.scale.linear()
              .domain([0, scope.max])
              .range([0, 10]);

            var color = d3.scale.linear()
              .clamp(true)
              .domain([0, scope.max])
              .range([scope.startColor, scope.endColor]);

            var arc = d3.svg.arc()
              .innerRadius(0)
              .outerRadius(function (d) {
                return valueScale(d.value) * config.scale;
              })
              .startAngle(function (d, i) {
                return (i - 1) * 2 * Math.PI / 24;
              })
              .endAngle(function (d, i) {
                return i * 2 * Math.PI / 24;
              });

            // Watch for resize event
            scope.$watch(function () {
              return angular.element(window)[0].innerWidth;
            }, function () {
              width = visService.getWidth(),
              height = visService.getHeight();

              scope.render(scope.days);
            });

            scope.render = function (days) {

              vis .attr("width", width)
                .attr("height", height)
                .attr("fill", "#161616");

              // force update...
              vis.selectAll("path").remove();

              vis.selectAll("path")
                .data(days)
                .enter()
                .append("path")
                .attr("d", arc)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                .attr("fill", function (d) {
                  return color(d.value);
                })
                .attr("opacity", "0.05")
                .on("mouseover", function (d, i) {
                // date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours()

                  var hour = i % 24;

                  if(hour < 10){
                    return tooltip
                      .style("visibility", "visible")
                      .html("Hour: 0" + hour + ".00");
                  } else {
                    return tooltip
                      .style("visibility", "visible")
                      .html("Hour: " + hour + ".00");
                  }

                })
                .on("mousemove", function () {
                  return tooltip
                    .style("top", (event.pageY) + "px")
                    .style("left", (event.pageX + 10) + "px");
                })
                .on("mouseout", function () {
                  return tooltip
                    .style("visibility", "hidden");
                });

              window.onresize = function () {
                scope.$apply();
              };

              // We update the dimensions to enable correct ratio when sharing the image
              ts.setDimensions(width, height);
              scope.rendered = true;
            };
          });
        }
      }
    };
  }]);
