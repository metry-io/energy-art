angular.module('energyArtApp')
  .controller('sidebarCtrl', function ($state, $window, emMeters, emDateUtil, emAuth, visService){
  	var vm = this;
  	vm.visualizers = visService.visualizers;
    vm.selectedVisualizer = visService.visualizer;
    vm.first = undefined;
    vm.last = undefined;

  	emMeters.query().then(function(res){
  		 vm.meters = res.data;
       visService.meter = vm.meters[0];
       vm.selectedMeter = visService.meter;
  	});

    //TODO: Create gln-meter-info directive
    vm.printMeterInfo = function(){
      if(vm.selectedMeter != undefined){
        return "<b>Address</b>: " +  vm.selectedMeter.address +
                "<br><b>Ean:</b> " + vm.selectedMeter.ean;
      }
      }

    vm.selectMeter = function(meter){
      console.log(meter);
      visService.meter = meter;
      vm.selectedMeter = visService.meter;
      vm.first = emDateUtil.getDate(meter.consumption_stats.energy.day.first);
      vm.last = emDateUtil.getDate(meter.consumption_stats.energy.day.last);
    };

    vm.selectVisualizer = function(visualizer){
      visService.visualizer = visualizer;
      vm.selectedVisualizer = visService.visualizer;
    };

    vm.loadVisualizer = function(date){
      var params = angular.copy($state.params);
      params.ean = vm.selectedVisualizer.ean;
      visService.date = date;
      $state.go(vm.selectedVisualizer.name);
    };

    vm.logOut = function(){
      emAuth.setRefreshToken(null);
      $state.go('auth');
    }

  });