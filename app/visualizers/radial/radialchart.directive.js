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

        var config = {
          scale: 15
        };

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

              var valueScale = d3.scale.linear()
                .domain([0, scope.max])
                .range([0, config.scale]);

              var color = d3.scale.linear()
                .clamp(true)
                .domain([0, scope.max])
                .range([scope.startColor, scope.endColor]);
              var arc = d3.svg.arc()
                .innerRadius(function(d, i){
                    var hour = i % 24;
                    return hour * config.scale;
                  })
                .outerRadius(function(d, i) {
                  var hour = i % 24;
                  return hour * config.scale + valueScale(d.value);
                })
                .startAngle(function(d, i) { return 2 * Math.PI *  ((Math.floor(i / 24) - 1) / scope.numDays); })
                .endAngle(function(d, i) { return 2 * Math.PI * Math.floor(i / 24) / scope.numDays; });

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

                vis.selectAll("path")
                  .data(days)
                  .enter()
                  .append("path")
                  .attr("d", arc)
                  .attr("fill", function(d) { return color(d.value)})
                  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                  .append("title")
                  .text(function (d) {
                    return d.value + " kWh";
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
                   .text(endDate.toDateString())
                   */
              };
            });
        }
      }
    };
  }]);

