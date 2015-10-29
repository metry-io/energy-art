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
    'energimolnet'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/auth', {
        templateUrl: 'views/auth.html',
        controller: 'AuthCtrl',
        controllerAs: 'auth'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/radialChart', {
        templateUrl: 'views/radialchart.html',
        controller: 'RadialchartCtrl',
        controllerAs: 'radialChart'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .constant('authConfig', {
      disabled: false,
      clientId: '',
      clientSecret: '',
      redirectUri: 'http://localhost:9000'
    })
  .run(function($rootScope, $location){
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      if($rootScope.authenticatedUser == null){
        $location.path("/auth");
      }
    })
  });


angular
  .module('energyArtApp').constant('apiBaseUrl', 'https://app.energimolnet.se/');