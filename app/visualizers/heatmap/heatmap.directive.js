'use strict';

/**
 * @ngdoc directive
 * @name energyArtApp.hexagon.directive
 * @description
 * # hexagon.directive
 * Factory in the energyArtApp.
 */

angular.module('energyArtApp')
  .directive('heatmap', ['d3Service', 'dataservice', 'visService', 'twitterShareService', function (d3Service, dataservice, visService, ts) {
    // Runs during compile
    return {
      restrict: 'E',
      link: function (scope, ele) {

        console.log('Heatmap');
        visService.init(scope, renderVis);

        function renderVis() {
          d3Service.d3().then(function (d3) {

            console.log("new data");

            var width = visService.getWidth(),
              height = visService.getHeight();

            // Make sure that the element i cleaned from svg's
            d3.select(ele[0]).selectAll("svg").remove();

            var vis = d3.select(ele[0])
              .append("svg")
              .attr("id", "visualization")
              .attr("width", width)
              .attr("height", height);

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
              var width = visService.getWidth(),
                height = visService.getHeight();

              scope.render(scope.days);
            });

            scope.render = function (days) {

              var rectWidth = width / scope.numDays,
                rectHeight = height / 24;

              vis.attr("width", width)
                .attr("height", height)
                .attr("fill", "#161616");

              vis.attr("transform", function (d, i) {
                return "translate(" + (Math.floor(i / 24) * rectWidth) + ",0)";
              });

              // force update...
              vis.selectAll("rect").remove();

              var tooltip = d3.select("tooltip");

              // Only animate if we have new data
              if (scope.newData) {
                vis.selectAll("rect")
                  .data(days)
                  .enter()
                  .append("rect")
                  .attr("class", "enter")
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
                  })
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
              }

              scope.rendered = true;
              ts.setDimensions(width, height);
            };
          });
        }
      }
    };
  }]);
