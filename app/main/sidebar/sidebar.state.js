angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider.state('sidebar', {
	  parent: 'main',
	  url: '/',
	  templateUrl: 'main/sidebar/sidebar.html',
	  controller: 'sidebarCtrl'
  })
});