'use strict';

/**
 * @ngdoc directive
 * @name energyArtApp.star.directive
 * @description
 * # star.directive
 *
 */

angular.module('energyArtApp')
  .directive('tooltip', ['d3Service', function (d3Service) {
    return {
      restrict: 'E',
      link: function (scope, ele) {
        d3Service.d3().then(function (d3) {
          d3.select(ele[0])
            .attr("top", "0 !important")
            .attr("class", "my-tooltip")
            .style("position", "absolute")
            // We make sure that the tooltip is in the front
            .style("z-index", Number.MAX_VALUE)
            .style("visibility", "hidden");
        });
      }
    };
  }]);
