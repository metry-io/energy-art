'use strict';

/**
 * @ngdoc directive
 * @name energyArtApp.hexagon.directive
 * @description
 * # hexagon.directive
 * Factory in the energyArtApp.
 */

angular.module('energyArtApp')
  .directive('hexagonChart', ['d3Service', 'dataservice', 'visService', 'twitterShareService', function (d3Service, dataservice, visService, ts) {
    // Runs during compile
    return {
      restrict: 'E',
      link: function (scope, ele, attr) {

        visService.init(scope, renderVis);

        function renderVis() {
          d3Service.d3().then(function (d3) {

            var width = visService.getWidth(),
              height = visService.getHeight();

            // Make sure that the element i cleaned from svg's
            d3.select(ele[0]).selectAll("svg").remove();

            // get the tooltip
            var tooltip = d3.select("tooltip");

            var vis = d3.select(ele[0]).append("svg")
              .attr("id", "visualization")
              .attr("width", width)
              .attr("height", height);

            // Find the max consumption value
            var max = scope.max;

            // We define the horizontal and vertical resolution of the chart here
            var hRes = 24,
              vRes = 20;

            // Create an empty bin array
            var binData = new Array(hRes);
            for (var hour = 0; hour < hRes; hour++) {
              binData[hour] = new Array(vRes);
              for (var bin = 0; bin < vRes; bin++) {
                binData[hour][bin] = 0;
              }
            }

            var bins = [];
            for (var i = 0; i < vRes; i++) bins.push(i);

            // We need to map energy value from the original value to range from 0 - 20
            // so that we can increment the correct bin
            var scaleValue = d3.scale.quantize()
              .domain([0, max])
              .range(bins);

            var maxBin = 0;

            // Increment the bin value where the current consumption value maps to
            scope.days.forEach(function (data, index) {
              var hour = index % 24;
              // We want to have an increasing consumption value going from bottom to top
              // therefore we index from vRes subtracted with the mapped consumption value
              binData[hour][(vRes - 1) - scaleValue(data.value)] += 1;
              if (binData[hour][(vRes - 1) - scaleValue(data.value)] > maxBin) maxBin = binData[hour][(vRes - 1) - scaleValue(data.value)];
            });

            var color = d3.scale.log()
              //hack to fix 0 values being ignored inside range due to log function
              .clamp(true)
              .domain([0.1, maxBin])
              .range([scope.startColor, scope.endColor]);

            var hexagonSize = 20;
            var hexagonWidth = hexagonSize * Math.sqrt(3);
            var hexagonHeight = hexagonSize * 2;
            var vDist = hexagonHeight * 3 / 4;
            var hDist = hexagonWidth;

            var hourScale = d3.time.scale()
              .domain([(new Date()).setHours(0), (new Date()).setHours(23)])
              .range([0, hexagonSize]);


            scope.hexagons = calcHexagons(hexagonSize, hRes, vRes);

            var ws = d3.scale.linear()
              .domain([0, hexagonSize - 1])
              .range([0, max]);

            // Bind data to each hexagon
            scope.hexagons.forEach(function (hexagon, index) {
              var row = Math.floor(index / 24);
              var col = index % 24;

              hexagon.value = binData[col][row];
              hexagon.consumption = ws(hexagonSize - 1 - row);
              // This depends on the fact that the amount of hexagons in the horizontal direction is 24..
              hexagon.time = col;
            });

            var scaleX = d3.scale.linear()
              .domain([0, hDist * hRes])
              .range([0, width / 2]);

            var scaleY = d3.scale.linear()
              .domain([0, vDist * vRes])
              .range([0, height / 2]);

            window.onresize = function () {
              scope.$apply();
            };

            // Watch for resize event
            scope.$watch(function () {
              return angular.element(window)[0].innerWidth;

            }, function () {
              var width = visService.getWidth(),
                  height = visService.getHeight();

              //TODO: take into account the ratio difference for a "normal" screen resolution
              scaleX = d3.scale.linear()
                .domain([0, hDist * hRes])
                .range([0, width + hDist]);

              scaleY = d3.scale.linear()
                .domain([0, vDist * vRes])
                .range([0, height + vDist]);

              scope.render(scope.hexagons, width, height);
            });

            scope.render = function (hexagons, width, height) {

              // force an update by removing all the polygons rendered
              // this can be improved by creating a separate update function
              vis.selectAll("polygon").remove();

              // we need to put everything inside an g tag since we want to translate all the hexagons
              vis
                .attr("width", width)
                .attr("height", height)
                .selectAll("polygon")
                .data(hexagons)
                .enter()
                .append("polygon")
                .attr("points", function (d) {
                  return d.hexagon.shape.map(function (h) {
                    return [scaleX(h.x), scaleY(h.y)].join(",");
                  }).join(" ");
                })
                .on("mouseover", function () {
                  d3.select(this).classed("hover", true);
                  d3.select(this.parentNode.appendChild(this)).transition(3000);
                })
                .on("mouseout", function () {
                  d3.select(this).classed("hover", false);
                })
                .attr("fill", function (d) {
                  return color(d.value);
                })
                .on("mouseover", function (d) {
                  var date = new Date(d.date);
                  return tooltip
                    .style("visibility", "visible")
                    .html("Occurances: " + d.value + "<br>" +
                      "Consumption: " + Math.round(d.consumption * 100) + "Wh<br>" +
                      "Hour: " + d.time);
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

              ts.setDimensions(width, height);
              scope.rendered = true;

            };

          });
        }

        ///////////////////////////////////////////////////////

        function calcHexagons(size, hRes, vRes) {
          var hexagons = [];

          for (var row = 0; row < vRes; row++) {
            for (var col = 0; col < hRes; col++) {
              var center = {
                "x": Math.sqrt(3) * size * col + Math.sqrt(3) * size / 2 * (row % 2),
                "y": size * 2 * 3 / 4 * row
              };
              var hexagon = calcHexagon(center, size);

              hexagons.push({"hexagon": {"shape": hexagon}});
            }
          }

          return hexagons;
        }

        function calcHexagon(center, size) {
          var hexagon = [];

          var angle = ((2 * Math.PI) / 6);
          var x = 0;
          var y = -size;

          for (var i = 0; i < 6; i++) {
            var s = Math.sin(angle * i);
            var c = Math.cos(angle * i);

            var nx = center.x + x * c + y * s;
            var ny = center.y - x * s + y * c;

            hexagon.push({"x": nx, "y": ny});
          }

          return hexagon;
        }
      }
    };
  }]);


