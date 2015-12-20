angular.module('visualizers', ['energimolnet'])
  .service('visService', function ($rootScope, dataservice) {
    var service = this;
    service.meters = "meters";

    var parameters = [];
    parameters.meter = undefined;
    parameters.startDate = undefined;
    parameters.endDate = undefined;

    $rootScope.$watch( function() {
      return service.getMeter();
    },
        function(meter){
          console.log("meter change");
          console.log(service.getParameters());
          if(meter != undefined){
            dataservice.getLatestConsumptionDate(meter).then(function(date){
              if(parameters.endDate == undefined || parameters.startDate == undefined ){
                console.log("time period change");
                parameters.endDate = date.yyyymmdd();
                var startDate = new Date();
                startDate.setDate(date.getDate() - 364);
                parameters.startDate = startDate.yyyymmdd();
                //console.log(parameters);
              }
            });
          }
    });

    service.visualizers = [
	    	{
	    		"name": "Radialchart",
          "url": "radialchart",
	    		"granularity": "year"
	    	},

	    	{
	    		"name": "Heatmap",
          "url": "heatmap",
	    		"granularity": "day"
	    	},

        {
          "name": "Hexagon",
          "url": "hexagon",
          "granularity": "day"
        },

        {
          "name": "Geomap",
          "url": "geomap",
          "granularity": ["day", "month", "year"]
        }
    	];


    service.setMeters = function(meters){
    	service.meters = "meters";
    };

    service.setMeter = function(meter){
      parameters.meter = meter;
    };

    service.setStartDate = function(date){
      parameters.startDate = date;
    };

    service.setEndDate = function(date){
      parameters.endDate = date;
    };

    service.getParameters = function(){
      return [parameters.meter, parameters.startDate, parameters.endDate];
    };

    service.getMeter = function(){
      return parameters.meter;
    };



  });

Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.getDate().toString();
  return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
};
