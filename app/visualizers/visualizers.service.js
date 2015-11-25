angular.module('visualizers', ['energimolnet'])
  .service('visService', function ($rootScope, emMeters, emDateUtil, emConsumptions) {
    var service = this;
    service.meter = undefined;
    service.meters = "meters";
    service.visualizers = [
	    	{ 
	    		"name": "radialchart",
	    		"granularity": "year"
	    	},

	    	{
	    		"name": "heatmap",
	    		"granularity": "day"
	    	},

            {
                "name": "hexagon",
                "granularity": "day"
            }
    	];
    service.visualizer = service.visualizers[0].name;

    service.setMeters = function(meters){
    	service.meters = "meters";
    }

  });