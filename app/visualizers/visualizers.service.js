angular.module('visualizers', ['energimolnet'])
  .service('visService', function ($rootScope, dataservice) {
    var service = this;
    service.meters = "meters";

    var parameters = [];
    const sidebarWidth = 60;

    parameters.meter = undefined;
    parameters.startDate = undefined;
    parameters.endDate = undefined;
    parameters.startColor = "hsl(235, 70%, 30%)";
    parameters.endColor = "hsl(235, 70%, 95%)";
    parameters.newData = true;

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
          "name": "Circle packing",
          "url": "circle_packing",
          "granularity": "day"
        },
        {
          "name": "Star",
          "url": "star",
          "granularity": ["day", "month", "year"]
        }
    	];


    service.setMeters = function(meters){
    	service.meters = "meters";
    };

    service.setMeter = function(meter){
      parameters.meter = meter;

      if(meter != undefined) {
        dataservice.getLatestConsumptionDate(meter).then(function (date) {
          if (parameters.endDate == undefined || parameters.startDate == undefined) {
            console.log("time period change");

            parameters.endDate = date.yyyymmdd();

            var startDate = new Date();
            startDate.setDate(date.getDate() - 364);
            parameters.startDate = startDate.yyyymmdd();
          }
          parameters.newData = true;
          update();
        });
      }

    };

    service.getWidth = function() {
      return  angular.element(window)[0].innerWidth - sidebarWidth;
    };

    service.getHeight = function() {
      return angular.element(window)[0].innerHeight;
    };

    service.setStartDate = function(date){
      parameters.startDate = date.yyyymmdd();
      parameters.newData = true;
      update();
    };

    service.setEndDate = function(date){
      parameters.endDate = date.yyyymmdd();
      parameters.newData = true;
      update();
    };

    service.setStartColor = function(color){
      parameters.startColor = color;
      update();
    };

    service.setEndColor = function(color){
      parameters.endColor = color;
      update();
    };

    service.getParameters = function(){
      return parameters;
      //[parameters.meter, parameters.startDate, parameters.endDate, parameters.startColor, parameters.endColor];
    };

    service.getMeter = function(){
      return parameters.meter;
    };

    // Initialize a template function for the current visualisation
    service.init = function(scope, renderVis)  {

      // Begin by updating the visualisation
      service.update(scope, renderVis, parameters);

      // Watch for parameters updated event and update the visualisation as soon as there is a change
      scope.$on('parameters:updated',
        function(event, parameters) {
          $rootScope.$emit("loadingData");
          service.update(scope, renderVis, parameters);
        });

    };

    service.update = function(scope, renderVis, parameters) {


      if( parametersOK(parameters) ) {

        // Initialize all the parameters to the current scope
        scope.newData = parameters.newData;
        scope.startDate = new Date(parameters.startDate);
        scope.endDate = new Date(parameters.endDate);
        scope.meter = parameters.meter;
        scope.startColor = parameters.startColor;
        scope.endColor = parameters.endColor;
        scope.numDays = dateDiffInDays(scope.startDate, scope.endDate);

        // If there is new data fetch for it
        if (scope.newData) {
          dataservice.getMeterDayData(scope.meter, scope.startDate, scope.endDate).then(function (d) {
            service.days = d;
            scope.days = d;


            dataservice.getMaxHourValue(scope.meter).then(function (d) {
              $rootScope.$emit("successData");
              service.max = d;
              scope.max = d;
            }).finally(function() {
              renderVis();
            });


            parameters.newData = false;
          });
        }
        else {
          scope.days = service.days;
          scope.max = service.max;
          $rootScope.$emit("successData");
          renderVis();
        }


      }
    };

    // Broadcasts an event to update the current visualization
    function update(){
      $rootScope.$broadcast('parameters:updated', parameters);
    }

  });


///////////////////////////////////////////////////////



function parametersOK(parameters){
  for ( var i = 0; i < parameters.length; i++){
    if(parameters[i] == undefined) return false;
  }
  return true;
}

 Date.prototype.yyyymmdd = function() {
 var yyyy = this.getFullYear().toString();
 var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
 var dd  = this.getDate().toString();
 return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
 };
