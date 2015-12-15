angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider
	.state('radialchart', {
	  parent: 'sidebar',
	  url: 'radialchart',
	  templateUrl: 'visualizers/radial/radialchart.html'
  })
});
