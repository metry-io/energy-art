angular.module('energyArtApp')
  .controller('sidebarCtrl', function ($state, $window, emMeters, emDateUtil, emAuth, visualizersService){
  	var vm = this;
  	vm.visualizers = visualizersService.visualizers;
    vm.selectedVisualizer = visualizersService.visualizer;
    vm.first = undefined;
    vm.last = undefined;

  	emMeters.query().then(function(res){
  		 vm.meters = res.data;
       visualizersService.meter = vm.meters[0];
       vm.selectedMeter = visualizersService.meter;
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
      visualizersService.meter = meter;
      vm.selectedMeter = visualizersService.meter;
      vm.first = emDateUtil.getDate(meter.consumption_stats.energy.day.first);
      vm.last = emDateUtil.getDate(meter.consumption_stats.energy.day.last);
    };

    vm.selectVisualizer = function(visualizer){
      visualizersService.visualizer = visualizer;
      vm.selectedVisualizer = visualizersService.visualizer;
    };

    vm.loadVisualizer = function(date){
      var params = angular.copy($state.params);
      params.ean = vm.selectedVisualizer.ean;
      visualizersService.date = date;
      $state.go(vm.selectedVisualizer.name, params);
    };

    vm.logOut = function(){
      emAuth.setRefreshToken(null);
      $window.location.href = "http://localhost:9000/#/auth";
    }

  });