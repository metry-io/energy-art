'use strict';

/**
 * @ngdoc directive
 * @name energyArtApp.hexagon.directive
 * @description
 * # hexagon.directive
 * Factory in the energyArtApp.
 */

angular.module('energyArtApp')
  .directive('circlePacking', ['d3Service', 'visService', 'twitterShareService', function (d3Service, visService, ts) {
    return {
      restrict: 'E',
      link: function (scope, ele) {

        var config = {
          diameter: 850
        };

        visService.init(scope, renderVis);

        function renderVis(){
          d3Service.d3().then(function (d3) {

            var width = visService.getWidth(),
              height = visService.getHeight();

            // Make sure that the element i cleaned from svg's
            d3.select(ele[0]).selectAll("svg").remove();

            var data = {"name": "root", children: []};

            var yIt = 0,
                mIt = 0,
                dIt = 0;

            scope.days.forEach(function(d) {
              var date = new Date(d.date);
              var year = date.getFullYear(),
                  month = date.getMonth(),
                  day = date.getDate(),
                  hour = date.getHours();

              if(data.children[yIt] == undefined) data.children[yIt] = {year: year, children: []};
              else if( data.children[yIt].year != year ){
                yIt++;
                dIt = 0;
                mIt = 0;
                data.children[yIt] = {year: year, children: []};
              }

              if( data.children[yIt].children[mIt] == undefined) data.children[yIt].children[mIt] = {month: month, children: []};

              else if( data.children[yIt].children[mIt].month != month ){
                mIt++;
                dIt = 0;
                data.children[yIt].children[mIt] = {month: month, children: []};
              }

              if( data.children[yIt].children[mIt].children[dIt] == undefined) data.children[yIt].children[mIt].children[dIt] = {day: day, children: []};
              else if( data.children[yIt].children[mIt].children[dIt].day != day ){
                dIt++;
                data.children[yIt].children[mIt].children[dIt] = {day: day, children: []};
              }


              data.children[yIt].children[mIt].children[dIt].children.push({hour: hour, value: d.value, date: d.date});

            });

            var vis = d3.select(ele[0])
              .append("svg")
              .attr("id", "visualization")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("transform", "translate(" + (width / 2 - config.diameter/2)  + "," + (height / 2 - config.diameter/2) + ")");

            var tooltip = d3.select("tooltip");

            var color = d3.scale.linear()
              .clamp(true)
              .domain([0, scope.max])
              .range([scope.startColor, scope.endColor]);

            var colorDepth = d3.scale.linear()
              .clamp(true)
              .domain([0, 3])
              .range(["#020202", "#181818"]);

            var pack = d3.layout.pack()
              .size([config.diameter - 4, config.diameter - 4])
              .value(function(d) { return  d.value; });

            window.onresize = function () {
              scope.$apply();
            };

            // Watch for resize event
            scope.$watch(function () {
              return angular.element(window)[0].innerWidth;
            }, function () {
              var width = visService.getWidth(),
                height = visService.getHeight();

              scope.render(data);
            });

            scope.render = function (data) {

              // force update...
              vis.selectAll(".node").remove();

              vis.attr("width", width)
                .attr("height", height);

              var node = vis.datum(data).selectAll(".node")
                .data(pack.nodes)
                .enter().append("g")
                .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
                .attr("fill", function(d) { return  d.children ? colorDepth(d.depth) : color(d.value); })
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                .on("mouseover", function (d) {
                  var date = new Date(d.date);
                  // date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours()
                  if(!d.children){
                    return tooltip
                      .style("visibility", "visible")
                      .html("Consumption: " + d.value + " kWh <br /> Date: " + d.date);
                  }
                })
                .on("mousemove", function () {
                  return tooltip
                    .style("top", (event.pageY) + "px")
                    .style("left", (event.pageX + 10) + "px");
                })
                .on("mouseout", function () {
                  return tooltip
                    .style("visibility", "hidden");
                });

              node.append("circle")
                .attr("r", function(d) { return d.r; });

              ts.setDimensions(width, height);
              scope.rendered = true;
            };
          });
        }
      }
    };
  }]);
