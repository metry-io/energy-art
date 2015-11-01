angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider.state('sidebar', {
	  parent: 'main',
	  url: '/',
	  templateUrl: 'main/sidebar.html',
	  controller: 'sidebarCtrl'
  })
});