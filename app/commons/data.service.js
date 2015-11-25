angular.module('commons', ['energimolnet'])
  .factory('dataservice', function ($rootScope, emMeters, emDateUtil, emConsumptions) {

  	var service = {
  		getMeterDayData: getMeterDayData,
  		getMaxHourValue: getMaxHourValue,
  		getMeters: getMeters
  	};

  	return service;

	//////////////////////////////////////////////////////////////////

	function getMeters() {
		var meters = emMeters.query().then(function(res){
			var meters = res.data;
  		    return meters;
  		  });
		return meters;
	}

    // Get meter day data
    function getMeterDayData(meter) {
    	var days = [];

    	var meterId = meter._id;
    	console.log(meterId);
	    emMeters.get(meterId)
	            .then(function(m) {
	                var hourData, startDate, endDate, period;

	                hourData = m.consumption_stats.energy.hour;
	                startDate = emDateUtil.getDate(hourData.last.toString());
	                startDate.setDate(startDate.getDate() - 364);
	                endDate = emDateUtil.getDate(hourData.last.toString());
	                period = emDateUtil.getDayPeriod([startDate, endDate]);


	                return emConsumptions.get(meterId, 'hour', period);
	            })
	            .then(function(consumptions) {
	                var data = consumptions[0].periods[0].energy;

	                for (var d = 0; d < 364; d++) {
	                    days.push(data.splice(0, 24));
	                }

	                $rootScope.$emit('successLoadingData');
	                return days;
	            });

	    return days;
    }

    function getMaxHourValue(meter){
    	var meterId = meter._id;
    	return emMeters.get(meterId)
	    		.then(function(m){
	    			return m.consumption_stats.energy.hour.max;
	    		});
    }

  });