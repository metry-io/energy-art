angular.module('energyArtApp')
  .controller('sidebarCtrl', function ($scope, $state, emAuth, meters, visualizers, visService){
  	var vm = this;
  	vm.visualizers = visualizers;
    vm.meters = meters;
    visService.meter = vm.meter;
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
      },
      {
        icon: "glyphicon-pencil",
        name: "color",
        template: "main/sidebar/tabs/color.tmpl.html"
      },
      {
        icon: "glyphicon-log-out",
        name: "logout",
        template: "main/sidebar/tabs/logout.tmpl.html"
      }
    ];


    //////////////////////////////////////////////////////////////////

    vm.selectMeter = function(meter){
      console.log("selecting meter");
      visService.setMeter(meter._id);
      vm.selectedMeter = meter;
      if(vm.selectedVisualizer != undefined) vm.loadVisualizer();
      // Move to settings bar
      //vm.first = emDateUtil.getDate(meter.consumption_stats.energy.day.first);
      //vm.last = emDateUtil.getDate(meter.consumption_stats.energy.day.last);
    };

    vm.selectVisualizer = function(visualizer){
      console.log(visualizer);
      //visService.visualizer = visualizer;
      vm.selectedVisualizer = visualizer;
      if(vm.selectedMeter != undefined) vm.loadVisualizer();
    };

    vm.loadVisualizer = function(){
      console.log(vm.selectedVisualizer.url);
      $state.go(vm.selectedVisualizer.url);
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
      visService.setStartDate(date);
    };

    vm.setEndDate = function(date) {
      visService.setEndDate(date);
    };

    vm.setStartColor = function(color){
      visService.setStartColor(color);
    };

    vm.setEndColor = function(color) {
      visService.setEndColor(color);
    };

    vm.getMeter = function() {
      return visService.getMeter();
    }

  });
