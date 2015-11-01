angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider
	.state('year', {
		  parent: 'sidebar',
		  url: 'year',
		  templateUrl: 'visualizers/year.tmpl.html'
	  	})
	.state('day', {
		  parent: 'sidebar',
		  url: 'day',
		  templateUrl: 'visualizers/day.tmpl.html'
	  	})
});