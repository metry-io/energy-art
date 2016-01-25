angular.module('energyArtApp')
  .config(function ($stateProvider){
    $stateProvider.state('circle_packing', {
      parent: 'sidebar',
      url: 'circle_packing',
      templateUrl: 'visualizers/circle_packing/circle_packing.tmpl.html'
    })
  });
