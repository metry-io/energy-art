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
      scope: {
        startDate: '=',
        endDate: '='
      },
      restrict: 'E',
      link: function (scope, ele, attr) {

        var startDate = new Date(attr.startDate),
            endDate = new Date(attr.endDate);

        var numDays = dateDiffInDays(startDate, endDate);

        dataservice.getMeterDayData(visService.meter, startDate, endDate).then(function (d) {
          scope.days = d;
        });


        dataservice.getMaxHourValue(visService.meter).then(function(d) {
          scope.max = d;
        });


        scope.$watch('days', function (days) {

          d3Service.d3().then(function (d3) {

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
                    sa = 2 * Math.PI * ((day - 1) / numDays),
                    ea = 2 * Math.PI * (day / numDays),
                    scale = 5;

                  arc.innerRadius(ir * scale)
                    .outerRadius(or * scale)
                    .startAngle(sa)
                    .endAngle(ea);

                  vis.append("path")
                    .attr("d", arc)
                    .attr("fill", color(value))
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                    .append("title")
                    .text(function(){
                      return value + " kWh";
                    });


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
                })
              });
            };
          });
        })
      }
    };
  }]);

var _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

