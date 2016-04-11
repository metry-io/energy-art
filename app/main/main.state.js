angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider.state('main', {
	  abstract: true,
	  templateUrl: 'main/main.html',
	  onEnter: function($state, $window, emAuth){
	  	// Moved to app.js
	  }
  })
});


