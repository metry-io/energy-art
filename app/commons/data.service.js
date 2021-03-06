
angular.module('commons', ['energimolnet'])
  .factory('dataservice', function ($rootScope, emMeters, emDateUtil, emConsumptions, emAccounts) {

    var service = {
      getMeterDayData: getMeterDayData,
      getMaxHourValue: getMaxHourValue,
      getMeters: getMeters,
      getLatestConsumptionDate: getLatestConsumptionDate,
      getMinDate: getMinDate,
      getMaxDate: getMaxDate
    };

    var counties = [];

    return service;

    //////////////////////////////////////////////////////////////////

    function getMeters() {
      return emAccounts.get('me/meters?box=active&consumption_stats.energy.hour.count=>0').then(function (res) {
        return res.data;
      });
    }

    function getMeterDayData(meter, startDate, endDate) {
      var days = [];
      var period = emDateUtil.getDayPeriod([startDate, endDate]);

      return emConsumptions.get(meter, 'hour', period)
        .then(function (consumptions) {
          var data = consumptions[0].periods[0].energy;
          var numDays = dateDiffInDays(startDate, endDate);
          var currentDate = new Date(startDate.getTime());

          for (var d = 0; d < numDays; d++) {
            data.splice(0, 24).forEach(function(value) {
              currentDate.setHours(currentDate.getHours() + 1);
              days.push({date: currentDate.toUTCString(), value: value});
            });

            // Increment the current date by one day
            currentDate.setDate(currentDate.getDate() + 1);
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

    function getMinDate(meter){
      return emMeters.get(meter)
        .then(function(m){
          var first = m.consumption_stats.energy.day.first;
          return emDateUtil.getDate(first.toString());
        });
    }

    function getMaxDate(meter){
      return emMeters.get(meter)
        .then(function(m){
          var last = m.consumption_stats.energy.day.last;
          return emDateUtil.getDate(last.toString());
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


  });

var _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

