'use strict';

/**
 * @ngdoc function
 * @name energyArtApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the energyArtApp
 */


angular.module('energyArtApp')
  .controller('AuthCtrl', function ($window, $location, $rootScope, emAuth) {
	  var vm = this;

    vm.redirect = function(){
	    $window.location.href =  emAuth.authorizeUrl();
	  };

	  var init = function (){
      //TODO: Find a cleaner way to do this
	    var code = ($window.location.search.replace("?code=", "")).replace("&state=emAuth","");
      console.log(code);
	    if(code !== ""){
	      emAuth.handleAuthCode(code);
        $rootScope.authenticatedUser = true;
	  	}
	  };

	  init();

  });