'use strict';

/**
 * @ngdoc function
 * @name energyArtApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the energyArtApp
 */


angular.module('energyArtApp')
  .controller('AuthCtrl', function ($window, $location, emAuth, authConfig, emDateUtil, emMeters, emConsumptions) {
  	var meterId = '543910253d329b4f008b4c9a';
    var vm = this;
    this.meter = undefined;
    this.maxValues = 0;
    this.day = [];

     // Get meter data
    emMeters.get(meterId)
    .then(function(m) {
      var hourData, startDate, endDate, period;

      hourData = m.consumption_stats.energy.hour;
      startDate = emDateUtil.getDate(hourData.last.toString());
      startDate.setDate(startDate.getDate() - 364);
      endDate = emDateUtil.getDate(hourData.last.toString());
      period = emDateUtil.getDayPeriod([startDate, endDate]);

      vm.meter = m;
      vm.maxValue = hourData.max;

      console.log(m);

      return emConsumptions.get(meterId, 'hour', period);
    })
    .then(function(consumptions) {
      var data = consumptions[0].periods[0].energy;

      for (var d = 0; d <364; d++) {
        vm.days.push(data.splice(0, 24));
      }
    });
    

	  vm.redirect = function(){
	    $window.location.href =  emAuth.authorizeUrl();
	  };

	  var init = function (){
	    var code = $location.search().code;
	    if(code !== null && emAuth.isAuthenticated()){
	      emAuth.handleAuthCode(code);
	  	}
	  };

	  init();

  });