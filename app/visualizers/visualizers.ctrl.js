angular.module('energyArtApp')
    .controller('visualizerCtrl', function($rootScope, emDateUtil, emMeters, emConsumptions, visService) {
        var vm = this;
        vm.meter = visService.meter;
        vm.meterId = visService.meter._id;
        vm.maxValues = 0;
        vm.days = [];
        vm.loader = 0;
        vm.incrementLoader = incrementLoader;
        getMeterDayData(vm.meterId, visService.first)

        //////////////////////////////////////////////////////////////////

        // Get meter data
        function getMeterDayData(meterId, startDate, endDate, granularity) {
        	var days = [];
            emMeters.get(vm.meterId)
                .then(function(m) {
                	$rootScope.$emit('startLoadingData');
                    var hourData, startDate, endDate, period;

                    hourData = m.consumption_stats.energy.hour;
                    startDate = emDateUtil.getDate(hourData.last.toString());
                    startDate.setDate(startDate.getDate() - 364);
                    endDate = emDateUtil.getDate(hourData.last.toString());
                    period = emDateUtil.getDayPeriod([startDate, endDate]);


                    vm.meter = m;
                    vm.maxValue = hourData.max;

                    console.log(m);

                    return emConsumptions.get(vm.meterId, 'hour', period);
                })
                .then(function(consumptions) {
                    var data = consumptions[0].periods[0].energy;

                    for (var d = 0; d < 364; d++) {
                        vm.days.push(data.splice(0, 24));
                    }

                    $rootScope.$emit('successLoadingData');
                    return days;
                });
        }

        function incrementLoader(){
        	vm.loader = vm.loader + 1;
        }


        this.getColor = function getColor(hourValue) {
            var max = vm.maxValue || 100;
            return 'hsl(173, 100%, ' + ((hourValue / max) * 75) + '%)';
        }

        this.getStroke = function getStroke(hourValue) {
            var max = vm.maxValue || 100;
            return (hourValue / max) * 50;
        }

        this.getPath = function getPath(day, hour, radius) {
            var r;
            r = radius * (hour / 24);

            var ax = radius + (r * Math.cos(2 * Math.PI * ((day - 1) / 365)))
            var ay = (r * Math.sin(2 * Math.PI * ((day - 1) / 365)))
            var bx = radius + (r * Math.cos(2 * Math.PI * (day / 365)))
            var by = (r * Math.sin(2 * Math.PI * (day / 365)))

            return 'M' + ax + ',' + ay + ' A' + radius + ',' + radius + ' 0 0,0 ' + bx + ',' + by
        }
    });