'use strict';

/**
 * @ngdoc function
 * @name energyArtApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the energyArtApp
 */

 angular.module('energyArtApp')
  .controller('HeaderCtrl', function ($location, $rootScope) {
    this.isActive = function (viewLocation) {
    	return viewLocation ===  $location.path();
    };
  });
