angular.module('visualizers', ['energimolnet'])
  .service('visualizersService', function () {
    var service = this;
    service.meter = undefined;
    service.visualizer = undefined;
    service.visualizers = [
	    	{ 
	    		"name": "radialchart",
	    		"granularity": "year"
	    	},

	    	{
	    		"name": "heatmap",
	    		"granularity": "day"
	    	}
    	];

  });