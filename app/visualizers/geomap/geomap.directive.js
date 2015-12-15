'use strict';

/**
 * @ngdoc directive
 * @name energyArtApp.hexagon.directive
 * @description
 * # hexagon.directive
 * Factory in the energyArtApp.
 */

angular.module('energyArtApp')
  .directive('geomap', ['d3Service', 'dataservice', 'visService', function(d3Service, dataservice, visService){
    // Runs during compile
    return {
      scope: {
      },
      restrict: 'E',
      link: function(scope, ele) {

        dataservice.getMeterDayData(visService.meter).then(function(d){
          scope.days = d;
        });

        scope.$watch('days', function(days){

          d3Service.d3().then(function(d3){

            var width = 960,
                height = 700;

            var projection = d3.geo.mercator()
              .scale(1)
              .translate([0, 0]);

            var path = d3.geo.path()
              .projection(projection);


            d3.json("../../resources/swe.topojson", function(error, swe){
              if (error) return console.error(error);

              scope.map = swe;

              scope.map.subunits = topojson.feature(swe, swe.objects.sverige);
              scope.map.counties = swe.objects.sverige.geometries;

              var b = path.bounds(topojson.merge(swe, scope.map.counties)),
                s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
                t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

              console.log(s + " " + t);
              projection.scale(s).translate(t);

              window.onresize = function() {
                scope.$apply();
              };

              // Watch for resize event
              scope.$watch(function() {
                return angular.element(window)[0].innerWidth;

              }, function() {
                scope.render(scope.map);
              });

            });


            scope.render = function(map){
              d3.select(ele[0]).selectAll("svg").remove();
              var vis = d3.select(ele[0]).append("svg")
                .attr("width", width)
                .attr("height", height);

              vis.selectAll('.munic')
                .data(map.subunits.features)
                .enter().append('path')
                .attr('class', function(d) { return 'munic munic--' + d.properties.KNKOD; })
                .attr('d', d3.geo.path().projection(projection));

              console.log(map.subunits.features);

              vis.append("g")
                .attr("class", "bubble")
                .selectAll("circle")
                .data(map.subunits.features)
                .enter().append("circle")
                .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
                .attr("r", 5);

              vis.append("text")
                .attr("text-anchor", "middle")
                .attr("font-size", "36px")
                .attr("font-weight", "800")
                .attr("fill", "#A4A4A4")
                .attr("transform", "translate(70,30)")
                .text("Sweden");
            };

          });
        }, true)
      }
    };
  }]);

