angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider.state('auth', {
	  url: '/auth',
	  templateUrl: 'main/auth.html',
	  controller: 'AuthCtrl'
  })
});