angular.module('energyArtApp')
  .config(function ($stateProvider){
    $stateProvider.state('geomap', {
      parent: 'sidebar',
      url: 'geomap',
      templateUrl: 'visualizers/geomap/geomap.html'
    })
  });
