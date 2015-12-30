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
            var newData = false;
            console.log(startDate);
            console.log(scope.startDate);
            if(!(scope.startDate === parameters[1] && scope.endDate === parameters[2] && scope.meter === meter)) newData = true;

            console.log(newData);

            scope.startDate = parameters[1];
            scope.endDate = parameters[2];
            scope.meter = meter;

            var startColor = parameters[3];
            var endColor = parameters[4];

            if(parametersOK(parameters)){
              var numDays = dateDiffInDays(startDate, endDate);

              dataservice.getMaxHourValue(meter).then(function (d) {
                scope.max = d;
              });

              if(newData){

                dataservice.getMeterDayData(meter, startDate, endDate).then(function (d) {
                  scope.days = d;
                  renderVis();
                });

              }
              else { renderVis(); }
            }
            function renderVis(){

              scope.$watch('days', function (days) {

                if (days != undefined) {
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
                      .range([startColor, endColor]);


                    window.onresize = function () {
                      scope.$apply();
                    };

                    // Watch for resize event
                    scope.$watch(function () {
                      return angular.element(window)[0].innerWidth;
                    }, function () {
                      width = vis.node().getBoundingClientRect().width;
                      height = vis.node().getBoundingClientRect().height;

                      scope.render(days);
                    });

                    scope.render = function (days) {
                      // Make sure that the element i cleaned from svg's
                      d3.select(ele[0]).selectAll("svg").remove();

                      vis = d3.select(ele[0])
                        .append("svg")
                        .attr("width", "100%")
                        .attr("height", "100%");

                      var rectWidth = width / numDays,
                          rectHeight = height / 24,
                          xOffset = 60;

                      var heatmap = vis.selectAll("g")
                        .data(days, function(d){ return d;});

                        heatmap.enter().append("g")
                          .attr("transform", function(data, day){ return "translate(" + (day * rectWidth + xOffset) + ",0)";})
                          .each(function (data) {
                            var col = d3.select(this).selectAll("rect")
                              .data(data);

                            // Only animate if we have new data
                            if(newData){
                              col.enter()
                                .append("rect")
                                .attr("class", "enter")
                                .attr("opacity", 0)
                                .transition().ease("linear")
                                .delay(function(d, i){
                                  return i * 400;
                                })
                                .duration(750)
                                .attr("opacity", 1)
                                .attr("y", function(d, i) { return i * rectHeight; })
                                .attr("width", rectWidth)
                                .attr("height", rectHeight)
                                .attr("fill", function(value){ return value == null ? 0:color(value); });
                            }

                            else{
                              col.enter()
                                .append("rect")
                                .attr("y", function(d, i) { return i * rectHeight; })
                                .attr("width", rectWidth)
                                .attr("height", rectHeight)
                                .attr("fill", function(value){ return value == null ? 0:color(value); })
                                .append("title")
                                .text(function(value){
                                  return value + " kWh";
                                });
                            }

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

