angular.module('energyArtApp')
  .controller('sidebarCtrl', function ($scope, $state, emAuth, meters, visualizers, visService, dataservice, twitterShareService) {
    var vm = this;
    vm.visualizers = visualizers;
    vm.meters = meters;
    visService.meter = vm.meter;
    vm.activeTab = "none";
    vm.twitterShare = twitterShareService.share;

    vm.startDate = {
      opened: false
    };
    vm.endDate = {
      opened: false
    };

    vm.tabs = [
      {
        icon: "glyphicon-flash",
        name: "general",
        template: "main/sidebar/tabs/general.tmpl.html",
        content: true
      },
      {
        icon: "glyphicon-time",
        name: "time",
        template: "main/sidebar/tabs/time.tmpl.html",
        content: true
      },
      {
        icon: "glyphicon-pencil",
        name: "color",
        template: "main/sidebar/tabs/color.tmpl.html",
        content: true
      },
      {
        icon: "glyphicon-log-out",
        name: "logout",
        template: "main/sidebar/tabs/logout.tmpl.html",
        content: false,
        hasAction: true,
        action: logOut
      },
      {
        icon: "glyphicon glyphicon-tower",
        name: "twitter",
        template: "main/sidebar/tabs/twitter.tmpl.html",
        content: false,
        hasAction: true,
        action: twitterShareService.share
      }
    ];


    //////////////////////////////////////////////////////////////////

    vm.selectMeter = function (meter) {
      console.log("selecting meter");
      visService.setMeter(meter._id);
      vm.selectedMeter = meter;

      dataservice.getMinDate(meter._id).then(function (date) {
        vm.minDate = date;
      });

      dataservice.getMaxDate(meter._id).then(function (date) {
        vm.maxDate = date;
      });

      if (vm.selectedVisualizer != undefined) vm.loadVisualizer();
    };

    vm.selectVisualizer = function (visualizer) {
      vm.selectedVisualizer = visualizer;
      if (vm.selectedMeter != undefined) vm.loadVisualizer();
    };

    vm.loadVisualizer = function () {
      $state.go(vm.selectedVisualizer.url);
    };

    function logOut() {
      emAuth.setRefreshToken(null);
      $state.go('auth');
    };

    vm.toggleActiveTab = function (tab) {
      if (vm.activeTab == tab) vm.activeTab = "none";
      else vm.activeTab = tab;
    };

    vm.openStartDate = function () {
      vm.startDate.opened = true;
    };

    vm.openEndDate = function () {
      vm.endDate.opened = true;
    };

    vm.setStartDate = function (date) {
      visService.setStartDate(date);
    };

    vm.setEndDate = function (date) {
      visService.setEndDate(date);
    };

    vm.setStartColor = function (color) {
      visService.setStartColor(color);
    };

    vm.setEndColor = function (color) {
      visService.setEndColor(color);
    };

    vm.getMeter = function () {
      return visService.getMeter();
    };


  });
