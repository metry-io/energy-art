angular.module('energyArtApp')
  .controller('sidebarCtrl', function ($scope, $state, emAuth, meters, visualizers, visService){
  	var vm = this;
  	vm.visualizers = visualizers;
    vm.meters = meters;
    vm.meter = meters[0];
    visService.meter = vm.meter;
    vm.selectedVisualizer = visualizers[0];

    console.log(vm.selectedVisualizer);

    //////////////////////////////////////////////////////////////////

    vm.selectMeter = function(meter){
      visService.meter = meter;
      vm.selectedMeter = visService.meter;
      // Move to settings bar
      //vm.first = emDateUtil.getDate(meter.consumption_stats.energy.day.first);
      //vm.last = emDateUtil.getDate(meter.consumption_stats.energy.day.last);
    };

    vm.selectVisualizer = function(visualizer){
      visService.visualizer = visualizer;
      vm.selectedVisualizer = visService.visualizer;
      vm.loadVisualizer("default");
    };

    vm.loadVisualizer = function(date){
      visService.date = date;
      $state.go(vm.selectedVisualizer.name);
    };

    vm.logOut = function(){
      emAuth.setRefreshToken(null);
      $state.go('auth');
    }

  });
