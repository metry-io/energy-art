angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider
	.state('hexagon', {
	  parent: 'sidebar',
	  url: 'hexagon',
	  templateUrl: 'visualizers/hexagon/hexagon.html'
  })
});