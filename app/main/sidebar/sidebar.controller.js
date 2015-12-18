angular.module('energyArtApp')
  .controller('sidebarCtrl', function ($scope, $state, emAuth, meters, visualizers, visService){
  	var vm = this;
  	vm.visualizers = visualizers;
    vm.meters = meters;
    vm.meter = meters[0];
    visService.meter = vm.meter;
    vm.selectedVisualizer = visualizers[0];
    vm.activeTab = "none";
    vm.status = {
      opened: false
    };


    vm.tabs = [
      {
        icon: "glyphicon-flash",
        name: "general",
        template: "main/sidebar/tabs/general.tmpl.html"
      },
      {
        icon: "glyphicon-time",
        name: "time",
        template: "main/sidebar/tabs/time.tmpl.html"
      }
    ];


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
      console.log(vm.selectedVisualizer.name);
      visService.date = date;
      $state.go(vm.selectedVisualizer.name);
    };

    vm.logOut = function(){
      emAuth.setRefreshToken(null);
      $state.go('auth');
    };

    vm.toggleActiveTab = function(tab){
      if(vm.activeTab == tab) vm.activeTab = "none";
      else vm.activeTab = tab;
    };

    vm.openDate = function($event){
      vm.status.opened = true;
      console.log(vm.status.opened);
    };

    vm.setStartDate = function(date){
      visService.startDate = date;
    }

    vm.setEndDate = function(date) {
      visService.endDate = date;
    }

  });
