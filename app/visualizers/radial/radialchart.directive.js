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

        dataservice.getMeterDayData(visService.meter).then(function (d) {
          scope.days = d;
        });

        dataservice.getMaxHourValue(visService.meter).then(function(d) {
          scope.max = d;
          console.log(scope.max);
        });

        console.log("Running radial chart directive");

        scope.$watch('days', function (days) {

          d3Service.d3().then(function (d3) {

            console.log("Running radial chart directive");

            var width = angular.element(window)[0].innerWidth,
              height = angular.element(window)[0].innerHeight * 0.70;

            // Make sure that the element i cleaned from svg's
            d3.select(ele[0]).selectAll("svg").remove();
            var vis = d3.select(ele[0])
              .append("svg")
              .attr("width", width)
              .attr("height", height);

            var arc = d3.svg.arc();

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

              vis.selectAll("*").remove();

              // it is recommended to use d3's each function for this but it was not as straightforward as one would
              // hoped it would be to use that method. But try at least to use it on the data variable
              days.forEach(function (data, day) {
                data.forEach(function (value, hour) {
                  var ir = hour * scope.max,
                    or = (ir + value),
                    sa = 2 * Math.PI * ((day - 1) / 364),
                    ea = 2 * Math.PI * (day / 364),
                    scale = 5;

                  arc.innerRadius(ir * scale)
                    .outerRadius(or * scale)
                    .startAngle(sa)
                    .endAngle(ea);

                  vis.append("path")
                    .attr("d", arc)
                    .attr("fill", color(value))
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
                })
              });
            };
          });
        })
      }
    };
  }]);


function getPath(day, hour, radius, hourValue) {
  var r;
  var max = vm.maxValue || 100;

  var offset = 5;
  var strokeOffset = ((hourValue / max) * 50) / 2;
  var hourOffset = (radius * (hour / 24));
  var prevMaxHeight = (max * 50 + radius * ((hour - 1) / 24)) || 0;
  r = hourOffset + strokeOffset + prevMaxHeight + offset;

  var ax = radius + (r * Math.cos(2 * Math.PI * ((day - 1) / 365)))
  var ay = (r * Math.sin(2 * Math.PI * ((day - 1) / 365)))
  var bx = radius + (r * Math.cos(2 * Math.PI * (day / 365)))
  var by = (r * Math.sin(2 * Math.PI * (day / 365)))

  return 'M' + ax + ',' + ay + ' A' + radius + ',' + radius + ' 0 0,0 ' + bx + ',' + by
}
