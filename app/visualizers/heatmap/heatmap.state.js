angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider.state('heatmap', {
	  parent: 'sidebar',
	  url: 'heatmap/:ean',
	  templateUrl: 'visualizers/heatmap/heatmap.tmpl.html',
	  controller: 'HeatmapCtrl',
	  controllerAs: 'heatmap'
  })
});