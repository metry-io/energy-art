'use strict';

/**
 * @ngdoc directive
 * @name energyArtApp.hexagon.directive
 * @description
 * # hexagon.directive
 * Factory in the energyArtApp.
 */

angular.module('energyArtApp')
  .directive('radialChart', ['d3Service', 'dataservice', 'visService', function(d3Service, dataservice, visService){
    // Runs during compile
    return {
      restrict: 'E',
      link: function(scope, ele) {

        dataservice.getMeterDayData(visService.meter).then(function(d){
          scope.days = d;
        });

        console.log("Running radial chart directive");

        scope.$watch('days', function(days){

          d3Service.d3().then(function(d3){

            console.log("Running radial chart directive");

            var width = 900,
                height = 600;

            var vis = d3.select(ele[0])
              .append("svg")
              .attr("width", width)
              .attr("height", height);

            // d is day and i is hour
            var arc = d3.svg.arc();

            window.onresize = function() {
              scope.$apply();
            };

            // Watch for resize event
            scope.$watch(function() {
              return angular.element(window)[0].innerWidth;

            }, function() {
              scope.render(days);
            });

            scope.render = function(days){
              d3.select(ele[0]).selectAll("svg").remove();
              var vis = d3.select(ele[0]).append("svg")
                .attr("width", width)
                .attr("height", height);
              vis.selectAll("*").remove();

              // it is recommended to use d3's each function for this but it was not as straightforward as one would
              // hoped it would be to use that method. But try at least to use it on the data variable
              days.forEach(function(data, day){
                data.forEach(function(value, hour){
                  var ir = hour,
                      or = (hour + value),
                      sa = 2*Math.PI * ((day-1)/365),
                      ea = 2*Math.PI * (day/365),
                      scale = 10;
                  arc
                    .innerRadius(ir * scale)
                    .outerRadius(or * scale)
                    .startAngle(sa)
                    .endAngle(ea);

                  vis.append("path")
                    .attr("d", arc)
                    .attr("fill", "steelblue")
                    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
                })
              });

              /*
              vis.selectAll("g")
                .data(days)
                .enter()
                .append("g")
                .each(function(data, day){
                  d3.select(this)
                    .selectAll("g")
                    .data(data)
                    .enter()
                    .append("g")
                    .each(function(value, hour){
                      var ir = hour,
                          or = (hour + value) * 10,
                          sa = 2*Math.PI * ((day-1)/365),
                          ea = 2*Math.PI * (day/365);
                      arc
                        .innerRadius(ir)
                        .outerRadius(or)
                        .startAngle(sa)
                        .endAngle(ea);

                      d3.select(this)
                        .selectAll("g")
                        .data(data)
                        .enter()
                        .append("g")
                    })
                    .attr("d", arc)
                    .fill("fill", "#fff");
                })
                .attr("transform", "translate(100,100)");*/
            };
          });
        })
      }
    };
  }]);


function getPath(day, hour, radius, hourValue){
  var r;
  var max = vm.maxValue || 100;

  var offset = 5;
  var strokeOffset = ((hourValue/ max) * 50)/2;
  var hourOffset = (radius * (hour/24));
  var prevMaxHeight = (max * 50 + radius * ((hour-1)/24)) || 0;
  r =   hourOffset + strokeOffset + prevMaxHeight + offset;

  var ax = radius + (r * Math.cos(2*Math.PI * ((day-1)/365)))
  var ay = (r * Math.sin(2*Math.PI * ((day-1)/365)))
  var bx = radius + (r * Math.cos(2*Math.PI * (day/365)))
  var by = (r * Math.sin(2*Math.PI * (day/365)))

  return 'M' + ax + ',' + ay + ' A' + radius + ',' + radius + ' 0 0,0 ' + bx + ',' + by
}
