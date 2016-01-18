angular.module('energyArtApp')
  .config(function ($stateProvider){
    $stateProvider
      .state('star', {
        parent: 'sidebar',
        url: 'star',
        templateUrl: 'visualizers/star/star.html'
      })
  });
