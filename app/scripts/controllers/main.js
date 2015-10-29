'use strict';

/**
 * @ngdoc function
 * @name energyArtApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the energyArtApp
 */


angular.module('energyArtApp')
  .controller('MainCtrl', function ($window, $location, emAuth) {
  	this.test = 'test';
  	this.redirect = function(){
      	$window.location.href =  emAuth.authorizeUrl();
  	};
  	var init = function (){
  		var code = $location.search().code;
  		if(code !== null && emAuth.isAuthenticated()){
  			var accesscode = emAuth.handleAuthCode(code);
  			console.log(code);
  		}
  	};
  	init();
  });

