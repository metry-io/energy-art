'use strict';

/**
 * @ngdoc function
 * @name energyArtApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the energyArtApp
 */


angular.module('energyArtApp')
  .controller('AuthCtrl', function ($window, $location, $rootScope, emAuth, commonsService) {
	var vm = this;

    vm.redirect = function(){
    	emAuth.setRefreshToken(null);
	    $window.location.href =  emAuth.authorizeUrl();
	};
  });