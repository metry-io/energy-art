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
      scope: {
        startDate: '=',
        endDate: '='
      },
      restrict: 'E',
      link: function (scope, ele) {

        scope.$watchCollection(
          function() { return visService.getParameters(); },
          function(parameters) {

            // Initializer parameters
            var meter = parameters[0];
            var startDate = new Date(parameters[1]);
            var endDate = new Date(parameters[2]);

            if(parametersOK(parameters)){
              renderVis();
            }

            function renderVis(){

              var numDays = dateDiffInDays(startDate, endDate);

              dataservice.getMeterDayData(meter, startDate, endDate).then(function (d) {
                scope.days = d;
              });

              dataservice.getMaxHourValue(meter).then(function (d) {
                scope.max = d;
              });

              scope.$watch('days', function (days) {

                if (days !== undefined) {
                  d3Service.d3().then(function (d3) {

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
                      .range(["hsl(235, 70%, 0%)", "hsl(235, 70%, 95%)"]);


                    window.onresize = function () {
                      scope.$apply();
                    };

                    // Watch for resize event
                    scope.$watch(function () {
                      return angular.element(window)[0].innerWidth;
                    }, function () {
                      width = vis.node().getBoundingClientRect().width;
                      height = vis.node().getBoundingClientRect().height;

                      // Do find a better solution...
                      if (days !== undefined) scope.render(days);
                    });

                    scope.render = function (days) {
                      vis.selectAll("*").remove();


                      days.forEach(function (data, day) {
                        data.forEach(function (value, hour) {

                          var rectWidth = width / numDays,
                            rectHeight = height / 24,
                            xOffset = 60;

                          vis.append("rect")
                            .attr("x", xOffset + day * rectWidth)
                            .attr("y", hour * rectHeight)
                            .attr("width", rectWidth)
                            .attr("height", rectHeight)
                            .attr("fill", color(value))
                            .append("title")
                            .text(function () {
                              return value + " kWh";
                            });
                        });
                      });

                    };
                  });
                }

              })

            }

            ///////////////////////////////////////////////////////

            function parametersOK(parameters){
              for ( var i = 0; i < parameters.length; i++){
                if(parameters[i] == undefined) return false;
              }
              return true;
            }

          });
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

