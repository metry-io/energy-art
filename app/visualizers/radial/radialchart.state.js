angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider
	.state('radialchart', {
	  parent: 'sidebar',
	  url: 'radialchart',
	  templateUrl: 'visualizers/radial/radialchart.html',
	  controller: 'RadialchartCtrl',
	  controllerAs: 'ctrl',
	  resolve: {
	  	data: function(dataservice, visService){
	  		return dataservice.getMeterDayData(visService.meter);
	  	},
	  	maxValue: function(dataservice, visService){
	  		return dataservice.getMaxHourValue(visService.meter);
	  	}
	  }
  })
});