angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider.state('auth', {
	  url: '/auth',
	  templateUrl: 'main/auth/auth.html',
	  controller: 'AuthCtrl'
  })
});