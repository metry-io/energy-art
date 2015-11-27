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
  .directive('hexagonChart', ['d3Service',function(d3Service){
  	// Runs during compile
  	return {
  		scope: {
        x: '=',
        y: '=',
        size: '='
      },
  		restrict: 'E',
  		link: function(scope, ele, attr, controller) {
  			d3Service.d3().then(function(d3){
          var size = scope.size;
  				var svg = d3.select(ele[0])
              .append("svg")
	            .attr("width", size)
              .attr("height", size);
          
          window.onresize = function() {
              scope.$apply();
            };

          var center = {
            "x" : scope.x,
            "y" : scope.y};
          

          var scaleX = d3.scale.linear()
              .domain([-size, size])
              .range([0,size]);

          var scaleY = d3.scale.linear()
          .domain([-size,size])
          .range([0,size]);


          function calculateHexagon(center, size){
            var poly = [];

            var angle = ((2 * Math.PI) / 6);
            var x = 0;
            var y = -size;

            for (var i = 0; i <= 6; i++) {
              var s = Math.sin(angle*i);
              var c = Math.cos(angle*i);

              var nx = x * c + y * s;
              var ny = x * s + y * c;

              poly.push({"x":nx,"y":ny});
            };
            return poly;
          };

          scope.poly = calculateHexagon(center, size);

          console.log(scope.poly);

          scope.$watch(function() {
              return angular.element(window)[0].innerWidth;
            }, function() {
              scope.render(scope.poly);
            });

          // Watch for resize event
          scope.$watch(function() {
            return angular.element(window)[0].innerWidth;
          }, function() {
            scope.render(scope.poly);
          });

          scope.render = function(poly){
            svg.selectAll("*").remove();

            svg.selectAll("polygon")
              .data([poly])
            .enter().append("polygon")
              .attr("points",function(d) { 
                  return d.map(function(d) { return [scaleX(d.x),scaleY(d.y)].join(","); }).join(" ");})
              .attr("stroke","steelblue")
              .attr("stroke-width",2);
          };
  			});
  		}
  	};
  }]);