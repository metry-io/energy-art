angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider.state('heatmap', {
	  parent: 'sidebar',
	  url: 'heatmap',
	  templateUrl: 'visualizers/heatmap/heatmap.tmpl.html',
	  controller: 'HeatmapCtrl',
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