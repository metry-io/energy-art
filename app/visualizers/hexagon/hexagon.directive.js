'use strict';

/**
 * @ngdoc directive
 * @name energyArtApp.hexagon.directive
 * @description
 * # hexagon.directive
 * Factory in the energyArtApp.
 */

// NEXT TIME: Lookup how to create a function in D3 to easily create hexagons without having to create a new svg each time
// Maybe it's enough to create a factory for the hexagonchart...?

angular.module('energyArtApp')
  .directive('hexagonChart', ['d3Service', 'dataservice', 'visService', function(d3Service, dataservice, visService){
  	// Runs during compile
  	return {
  		scope: {
        x: '=',
        y: '=',
        size: '='
      },
  		restrict: 'E',
  		link: function(scope, ele, attr, controller) {

        dataservice.getMeterDayData(visService.meter).then(function(d){
          scope.days = d;
        });

        scope.$watch('days', function(days){
          d3Service.d3().then(function(d3){

          var max = d3.max(days, function(d) { 
            return d3.max(d, function(value){ 
              return value; 
            })
          });


          // We define the horizontal and vertical resolution of the chart here
          var hRes = 24,
              vRes = 20;

          var binData = new Array(hRes);
          for (var hour = 0; hour < hRes; hour++) {
            binData[hour] = new Array(vRes);
            for (var bin = 0; bin < vRes; bin++) {
              binData[hour][bin] = 0;
            };
          };

          var bins = [];
          for (var i = 0; i < vRes; i++) bins.push(i);

          // We need to map energy value from the original value to range from 0 - 20
          // so that we can increment the correct bin
          var scaleValue = d3.scale.quantize()
            .domain([0, max])
            .range(bins);

          var maxBin = 0;

          // Increment the bin value where the current consumption value maps to
          days.forEach(function(data){
            data.forEach(function(value, index){
              // We want to have an increasing consumption value going from bottom to top
              // therefore we index from vRes subtracted with the mapped consumption value
              binData[index][(vRes - 1) - scaleValue(value)] += 1;
              if(binData[index][(vRes - 1) - scaleValue(value)] > maxBin) maxBin = binData[index][(vRes - 1) - scaleValue(value)];
            });
          });

          console.log(maxBin);
          var color = d3.scale.log()
              .domain([1, maxBin])
              .range(["hsl(235, 100%, 5%)", "hsl(235, 100%, 95%)"]);

          var hexagonSize = scope.size;
          var hexagonWidth = hexagonSize * Math.sqrt(3);
          var hexagonHeight = hexagonSize * 2;
          var vDist = hexagonHeight * 3/4;
          var hDist = hexagonWidth;

          var vis = d3.select(ele[0])
              .append("svg")
              .attr("width", "100%")
              .attr("height", "80%");

          var xsvg = d3.select(ele[0])
                  .append("svg");
          

          scope.hexagons = calcHexagons(hexagonSize, hRes, vRes);

          scope.hexagons.forEach(function(hexagon, index){
            var row = Math.floor(index/24);
            var col = index % 24;

            console.log(row);
            hexagon.value = binData[col][row];
          });

          var scaleX = d3.scale.linear()
              .domain([0, hDist * hRes])
              .range([0, angular.element(window)[0].innerWidth / 2]);

          var scaleY = d3.scale.linear()
            .domain([0, vDist * vRes])
            .range([0,angular.element(window)[0].innerHeight / 2]);

            window.onresize = function() {
              scope.$apply();
            };

          // Watch for resize event
          scope.$watch(function() {
            console.log(angular.element(window)[0].innerWidth);

            return angular.element(window)[0].innerWidth;
          }, function() {
            vis.attr("width", angular.element(window)[0].innerWidth / 2)
              .attr("height", angular.element(window)[0].innerHeight / 2);

            scaleX = d3.scale.linear()
              .domain([hDist, hDist * hRes - hDist])
              .range([0, angular.element(window)[0].innerWidth / 2]);

            scaleY = d3.scale.linear()
              .domain([vDist, vDist * vRes - vDist])
              .range([0,angular.element(window)[0].innerHeight / 2]);

            scope.render(scope.hexagons);
          });

          scope.render = function(hexagons){
            vis.selectAll("*").remove();
            xsvg.selectAll("*").remove();

            vis.selectAll("polygon")
              .data(hexagons)
              .enter().append("polygon")
                .attr("points",function(d) {
                    return d.hexagon.shape.map(function(h) {
                      return [scaleX(h.x),scaleY(h.y)].join(","); 
                  }).join(" ");
                })
                .attr("stroke","midnightblue")
                .attr("stroke-width",1)
                .style("fill", function(d) {
                  return color(d.value);
                })
                .append("svg:title")
                .text(function(d){
                  return d.value;
                });

            var wattScale = d3.scale.linear()
              .domain([0, max])
              .range([0, angular.element(window)[0].innerHeight / 2]);

            var yAxis = d3.svg.axis()
              .scale(wattScale)
              .orient("left")
              .ticks(20);

            vis.append("g")
              .call(yAxis);

            var hourScale = d3.time.scale()
              .domain([new Date("2015-03-25T01:00:00"), new Date("2015-03-25T23:00:00")])
              .range([0, angular.element(window)[0].innerWidth / 2 - hDist]);

            var xAxis = d3.svg.axis()
              .scale(hourScale)
              .orient("bottom")
              .ticks(d3.time.hour, 1)
              .tickFormat(d3.time.format("%H"));


            vis.attr("width", angular.element(window)[0].innerWidth / 2)
              .append("g")
              .attr("transform", "translate(" + hDist/2 + "," + angular.element(window)[0].innerHeight / 2 + ")")
              .call(xAxis);
        };
        });
        })
  		}
  	};
  }]);

function calcHexagons(size, hRes, vRes){
  var hexagons = [];

  for (var row = 0; row < vRes; row++) {
    for (var col = 0; col < hRes; col++) {
      var center = {
        "x" :  Math.sqrt(3) * size * col + Math.sqrt(3) * size / 2 * (row%2),
        "y" : size * 2  * 3/4 * row 
      };
      var hexagon = calcHexagon(center, size);

      hexagons.push({"hexagon": { "shape" : hexagon }});
    };
  };

  return hexagons;
}

function calcHexagon(center, size){
  var hexagon = [];

  var angle = ((2 * Math.PI) / 6);
  var x = 0;
  var y = -size;

  for (var i = 0; i < 6; i++) {
    var s = Math.sin(angle*i);
    var c = Math.cos(angle*i);

    var nx = center.x + x * c + y * s;
    var ny = center.y - x * s + y * c;

    hexagon.push({"x":nx,"y":ny});
  };

  return hexagon;
};