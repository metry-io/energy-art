angular.module('visualizers', ['energimolnet'])
  .service('visService', function ($rootScope, emMeters, emDateUtil, emConsumptions) {
    var service = this;
    service.meter = undefined;
    service.meters = "meters";
    service.startDate = "2014-01-01";
    service.endDate = "2014-02-01";

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
        },

      {
        "name": "geomap",
        "granularity": ["day", "month", "year"]
      }
    	];
    service.visualizer = service.visualizers[0].name;

    service.setMeters = function(meters){
    	service.meters = "meters";
    }

  });
