angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider
	.state('sidebar', {
	  parent: 'main',
	  url: '/',
	  templateUrl: 'main/sidebar/sidebar.html',
	  controller: 'sidebarCtrl',
	  controllerAs: 'sidebar',
	  resolve:{
	  	meters: function(dataservice){
	  	  return dataservice.getMeters();
	  	},
	  	visualizers: function(visService){
	  		return visService.visualizers;
	  	}
	  }
  })
});
