'use strict';

/**
 * @ngdoc directive
 * @name energyArtApp.star.directive
 * @description
 * # star.directive
 * Factory in the energyArtApp.
 */

angular.module('energyArtApp')
  .directive('star', ['d3Service', 'dataservice', 'visService', function (d3Service, dataservice, visService) {
    return {
      restrict: 'E',
      link: function (scope, ele) {
        visService.init(scope, renderVis);

        function renderVis() {
              d3Service.d3().then(function (d3) {

                console.log("new data");

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
                  width = vis.node().getBoundingClientRect().width;
                  height = vis.node().getBoundingClientRect().height;

                  scope.render(scope.days);
                });

                scope.render = function (days) {
                  vis.selectAll("*").remove();

                  var star = vis.selectAll("g")
                    .data(days, function(d){
                      return d;
                    });


                    days.forEach(function(day){
                      day.forEach(function(value, index){
                        arc.innerRadius(0)
                          .outerRadius(valueScale(value) * 40)
                          .startAngle((index-1) * 2 * Math.PI / 24)
                          .endAngle(index * Math.PI * 2 / 24);

                        vis.append("path")
                          .attr("d", arc)
                          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                          .attr("fill", color(value))
                          .attr("opacity", "0.05")
                          .append("title");
                      });

                    });
                };
              });
            };
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

