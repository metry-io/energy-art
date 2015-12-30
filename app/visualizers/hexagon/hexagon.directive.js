'use strict';

/**
 * @ngdoc directive
 * @name energyArtApp.hexagon.directive
 * @description
 * # hexagon.directive
 * Factory in the energyArtApp.
 */

angular.module('energyArtApp')
  .directive('hexagonChart', ['d3Service', 'dataservice', 'visService', function(d3Service, dataservice, visService){
  	// Runs during compile
  	return {
  		scope: {
        x: '=',
        y: '=',
        size: '=',
        startDate: '=',
        endDate: '='
      },
  		restrict: 'E',
  		link: function(scope, ele, attr) {

        scope.$watchCollection(
          function() { return visService.getParameters(); },
          function(parameters) {

            if(parametersOK(parameters)){

              // Initialize parameters
              var meter = parameters[0];
              var startDate = new Date(parameters[1]);
              var endDate = new Date(parameters[2]);
              var startColor = parameters[3];
              var endColor = parameters[4];

              renderVis();
            }

            function renderVis(){

              dataservice.getMeterDayData(meter, startDate, endDate).then(function (d) {
                scope.days = d;
              });

              scope.$watch('days', function(days){

                d3Service.d3().then(function(d3){

                  // Find the max consumption value
                  var max = d3.max(days, function(d) {
                    return d3.max(d, function(value){
                      return value;
                    })
                  });


                  // We define the horizontal and vertical resolution of the chart here
                  var hRes = 24,
                    vRes = 20;

                  // Create an empty bin array
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

                  var color = d3.scale.log()
                    //hack to fix 0 values being ignored inside range due to log function
                    .clamp(true)
                    .domain([0.1, maxBin])
                    .range([startColor, endColor]);

                  var hexagonSize = scope.size;
                  var hexagonWidth = hexagonSize * Math.sqrt(3);
                  var hexagonHeight = hexagonSize * 2;
                  var vDist = hexagonHeight * 3/4;
                  var hDist = hexagonWidth;

                  var vis = d3.select(ele[0])
                    .append("svg");

                  var xsvg = d3.select(ele[0])
                    .append("svg");


                  scope.hexagons = calcHexagons(hexagonSize, hRes, vRes);

                  var ws = d3.scale.linear()
                    .domain([0, 19])
                    .range([0, max]);

                  // Bind data to each hexagon
                  scope.hexagons.forEach(function(hexagon, index){
                    var row = Math.floor(index/24);
                    var col = index % 24;

                    hexagon.value = binData[col][row];
                    hexagon.consumption = ws(19 - row);
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
                    return angular.element(window)[0].innerWidth;

                  }, function() {
                    var width = angular.element(window)[0].innerWidth;
                    var height = angular.element(window)[0].innerHeight;

                    //TODO: take into account the ratio difference for a "normal" screen resolution
                    scaleX = d3.scale.linear()
                      .domain([0, hDist * hRes])
                      .range([0, width + hexagonSize]);

                    scaleY = d3.scale.linear()
                      .domain([0, vDist * vRes])
                      .range([0,height + vDist]);

                    scope.render(scope.hexagons);
                  });

                  scope.render = function(hexagons){
                    var width = angular.element(window)[0].innerWidth;
                    var height = angular.element(window)[0].innerHeight;

                    d3.select(ele[0]).selectAll("svg").remove();

                    var vis = d3.select(ele[0]).append("svg");

                    var legendOffset = 100;

                    vis.attr("width", width + legendOffset)
                      .attr("height", height);

                    /*
                     MAKE THESE OPTIONAL


                     var wattScale = d3.scale.linear()
                     .domain([0, max])
                     .range([angular.element(window)[0].innerHeight / 2, 0]);

                     var yAxis = d3.svg.axis()
                     .scale(wattScale)
                     .orient("left")
                     .ticks(20);

                     vis.append("g")
                     .attr("height", "100%")
                     .attr("width", "100%")
                     .attr("fill", "#A4A4A4")
                     .attr("transform", "translate(60,0)")
                     .call(yAxis);

                     */

                    // we need to put everything inside an g tag since we want to translate all the hexagons
                    vis.append("g")
                      .attr("transform", "translate(60,0)")
                      .append("svg")
                      .attr("width",width)
                      .attr("height", height)
                      .selectAll("polygon")
                      .data(hexagons)
                      .enter().append("polygon")
                      .attr("points",function(d) {
                        return d.hexagon.shape.map(function(h) {
                          return [scaleX(h.x),scaleY(h.y)].join(",");
                        }).join(" ");
                      })
                      .on("mouseover", function() {
                        d3.select(this).classed("hover", true);
                        d3.select(this.parentNode.appendChild(this)).transition(3000);
                      })
                      .on("mouseout", function() {
                        d3.select(this).classed("hover", false);
                      })
                      .attr("fill", function(d) {
                        return color(d.value);
                      })
                      .append("svg:title")
                      .text(function(d){
                        return d.value + " occurances around " + Math.round(d.consumption * 100) + " Wh in consumption";
                      });

                    /*

                    var x = d3.scale.linear()
                      .domain([0, 180])
                      .range([width *0.15,  width *0.85])
                      .clamp(true);

                    var brush = d3.svg.brush()
                      .x(x)
                      .extent([0, 0])
                      .on("brush", brushed);


                    var slider = vis.append("g")
                      .call(brush);

                    slider.selectAll(".extent,.resize")
                      .remove();

                    slider.select(".background")
                      .attr("height", 20)
                      .attr("y", height * 0.95);

                    var handle = slider.append("circle")
                      .attr("class", "handle")
                      .attr("transform", "translate(0," + height *0.95 + ")")
                      .attr("r", 9);

                    slider
                      .call(brush.event)
                      .transition() // gratuitous intro!
                      .duration(750)
                      .call(brush.extent([70, height * 0.95]))
                      .call(brush.event);

                    function brushed() {
                      var value = brush.extent()[0];

                      if (d3.event.sourceEvent) { // not a programmatic event
                        value = x.invert(d3.mouse(this)[0]);
                        brush.extent([value, value]);
                      }

                      handle.attr("cx", x(value));
                    }
                    */

                    /*
                     MAKE THIS OPTIONAL

                     var hourScale = d3.time.scale()
                     // e.g. for 23 h span "2015-03-25T01:00:00" - "2015-03-25T24:00:00"
                     .domain([new Date("2015-03-25T01:00:00"), new Date("2015-03-25T24:00:00")])
                     .range([0, angular.element(window)[0].innerWidth / 2]);

                     var xAxis = d3.svg.axis()
                     .scale(hourScale)
                     .orient("bottom")
                     .ticks(d3.time.hour, 1)
                     .tickFormat(d3.time.format("%H:%M"));


                     vis.append("g")
                     .attr("width", angular.element(window)[0].innerWidth / 2 + 50)
                     // should be translated by the same height as the svg for the visualization
                     .attr("fill", "#A4A4A4")
                     .attr("transform", "translate(60," + angular.element(window)[0].innerHeight / 2 + ")")
                     .call(xAxis)
                     .selectAll("text")
                     .attr("transform", "translate(30,20)rotate(45)");;

                     var hourLabelOffset = angular.element(window)[0].innerHeight / 2 + 70;




                     vis.append("text")
                     .attr("text-anchor", "middle")
                     .attr("font-size", "36px")
                     .attr("font-weight", "800")
                     .attr("fill", "#A4A4A4")
                     .attr("transform", "translate(" + angular.element(window)[0].innerWidth / 2 + "," + hourLabelOffset+ ")")
                     .text("Hour");

                     var kWhLabelOffset = angular.element(window)[0].innerHeight / 2 - 20;

                     vis.append("text")
                     .attr("text-anchor", "middle")
                     .attr("font-size", "36px")
                     .attr("font-weight", "800")
                     .attr("fill", "#A4A4A4")
                     .attr("transform", "translate(30 , " + kWhLabelOffset+ ")rotate(-90)")
                     .text("kWh");
                     */
                  };
                });
              });
            }

            ///////////////////////////////////////////////////////

            function parametersOK(parameters){
              for ( var i = 0; i < parameters.length; i++){
                if(parameters[i] == undefined) return false;
              }
              return true;
            }

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
                }
              }

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
              }

              return hexagon;
            }

          })
  		}
  	};
  }]);


