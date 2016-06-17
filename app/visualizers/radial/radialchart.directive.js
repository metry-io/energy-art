'use strict';

/**
 * @ngdoc directive
 * @name energyArtApp.hexagon.directive
 * @description
 * # hexagon.directive
 * Factory in the energyArtApp.
 */

angular.module('energyArtApp')
  .directive('radialChart', ['$rootScope', 'd3Service', 'dataservice', 'visService', 'twitterShareService', function ($rootScope, d3Service, dataservice, visService, ts) {
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

            // NOTE: Size of sidebar is 60px
            var width = angular.element(window)[0].innerWidth - 60,
              height = angular.element(window)[0].innerHeight;

            // Make sure that the element i cleaned from svg's
            d3.select(ele[0]).selectAll("svg").remove();

            var tooltip = d3.select("tooltip");

            var vis = d3.select(ele[0])
              .append("svg")
              .attr("id", "visualization")
              .attr("width", width)
              .attr("height", height);

            vis.append("rect")
              .attr("width", width)
              .attr("height", height)
              .attr("fill", "#161616");

            var valueScale = d3.scale.linear()
              .domain([0, scope.max])
              .range([0, config.scale]);

            var color = d3.scale.linear()
              .clamp(true)
              .domain([0, scope.max])
              .range([scope.startColor, scope.endColor]);

            var arc = d3.svg.arc()
              .innerRadius(function (d, i) {
                var hour = i % 24;
                return hour * config.scale;
              })
              .outerRadius(function (d, i) {
                var hour = i % 24;
                return hour * config.scale + valueScale(d.value);
              })
              .startAngle(function (d, i) {
                return 2 * Math.PI * ((Math.floor(i / 24) - 1) / scope.numDays);
              })
              .endAngle(function (d, i) {
                return 2 * Math.PI * Math.floor(i / 24) / scope.numDays;
              });

            window.onresize = function () {
              scope.$apply();
            };

            // Watch for resize event
            scope.$watch(function () {
              return angular.element(window)[0].innerWidth;
            }, function () {
              width = angular.element(window)[0].innerWidth - 60;
              height = angular.element(window)[0].innerHeight;

              if (scope.days !== undefined) scope.render(scope.days);
            });

            scope.render = function (days) {

              vis.attr("width", width)
                .attr("height", height)
                .attr("fill", "#161616");

              // force update...
              vis.selectAll("path").remove();

              vis.selectAll("path")
                .data(days)
                .enter()
                .append("path")
                .attr("d", arc)
                .attr("fill", function (d) {
                  return color(d.value)
                })
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                .on("mouseover", function (d) {
                  var date = new Date(d.date);
                  // date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours()
                  return tooltip
                    .style("visibility", "visible")
                    .html("Consumption: " + d.value + " kWh <br /> Date: " + d.date);
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

              // We update the dimensions to enable correct ratio when sharing the image
              ts.setDimensions(width, height);
              scope.rendered = true;

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

