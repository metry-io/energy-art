angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider.state('heatmap', {
	  parent: 'sidebar',
	  url: 'heatmap',
	  templateUrl: 'visualizers/heatmap/heatmap.tmpl.html',
	  controller: 'visualizerCtrl',
	  controllerAs: 'ctrl'
  })
});