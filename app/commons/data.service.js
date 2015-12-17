
angular.module('commons', ['energimolnet'])
  .factory('dataservice', function ($rootScope, emMeters, emDateUtil, emConsumptions) {

    var service = {
      getMeterDayData: getMeterDayData,
      getMaxHourValue: getMaxHourValue,
      getMeters: getMeters,
      addCounty: addCounty,
      getCounty: getCounty,
      dateDiffInDays: dateDiffInDays
    };

    var counties = [];

    return service;

    //////////////////////////////////////////////////////////////////

    function getMeters() {
      var meters = emMeters.query().then(function (res) {
        var meters = res.data;
        return meters;
      });
      return meters;
    }

    function getMeterDayData(meter, startDate, endDate) {
      var days = [];
      var meterId = meter._id;
      var period = emDateUtil.getDayPeriod([startDate, endDate]);

      return emConsumptions.get(meterId, 'hour', period)
        .then(function (consumptions) {
          var data = consumptions[0].periods[0].energy;

          for (var d = 0; d < 364; d++) {
            days.push(data.splice(0, 24));
          }

          return days;
        });
    }

    function getMaxHourValue(meter) {
      var meterId = meter._id;
      return emMeters.get(meterId)
        .then(function (m) {
          return m.consumption_stats.energy.hour.max;
        });
    }

    function getMinHourValue(meter) {
      var meterId = meter._id;
      return emMeters.get(meterId)
        .then(function (m) {
          return m.consumption_stats.energy.hour.min;
        });
    }

    //NEXT: Find a way to store already retrieved data to minimize the number of calls to the google geocoder API
    function addCounty(address) {
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode({"address": address}, function (results, status) {
        alert(results[0].address_components[2].short_name);
        counties.push(results[0].address_components[2].short_name);

      });
    }

    function getCounty(address) {
      return counties;
    }



  });
