
angular.module('commons', ['energimolnet'])
  .factory('dataservice', function ($rootScope, emMeters, emDateUtil, emConsumptions) {

    var service = {
      getMeterDayData: getMeterDayData,
      getMaxHourValue: getMaxHourValue,
      getMeters: getMeters,
      addCounty: addCounty,
      getCounty: getCounty,
      getLatestConsumptionDate: getLatestConsumptionDate
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
      var period = emDateUtil.getDayPeriod([startDate, endDate]);

      return emConsumptions.get(meter, 'hour', period)
        .then(function (consumptions) {
          var data = consumptions[0].periods[0].energy;
          var numDays = dateDiffInDays(startDate, endDate);

          for (var d = 0; d < numDays; d++) {
            days.push(data.splice(0, 24));
          }

          return days;
        });
    }

    function getLatestConsumptionDate(meter){
      return emMeters.get(meter)
        .then(function(m) {
          var hourData, latestDate;

          hourData = m.consumption_stats.energy.hour;
          latestDate = emDateUtil.getDate(hourData.last.toString());

          return latestDate;
          });
    }

    function getMaxHourValue(meter) {
      return emMeters.get(meter)
        .then(function (m) {
          return m.consumption_stats.energy.hour.max;
        });
    }

    function getMinHourValue(meter) {
      return emMeters.get(meter)
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

var _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

