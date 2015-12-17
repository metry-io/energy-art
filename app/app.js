'use strict';

/**
 * @ngdoc overview
 * @name energyArtApp
 * @description
 * # energyArtApp
 *
 * Main module of the application.
 */

angular
  .module('energyArtApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'energimolnet',
    'ui.router',
    'ui.bootstrap',
    'commons',
    'visualizers',
    'angular-spinkit',
    'd3'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  });


angular
  .module('energyArtApp').constant('apiBaseUrl', 'https://app.metry.io/');

angular
  .module('energyArtApp').run([
    'emAuth',
    'authConfig',
    function(auth, config){
      //TODO: fix this
      auth.setPrivateToken(config.privateToken);
    }
    ]);


//Make sure that we track errors on ui-router
angular.module('energyArtApp').run(['$rootScope',
    function($rootScope){
  $rootScope.$on("$stateChangeError", console.log.bind(console));
}]);
