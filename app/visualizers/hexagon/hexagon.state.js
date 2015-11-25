angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider
	.state('hexagon', {
	  parent: 'sidebar',
	  url: 'hexagon',
	  templateUrl: 'visualizers/hexagon/hexagon.html',
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