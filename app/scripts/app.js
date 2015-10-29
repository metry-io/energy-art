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
        templateUrl: 'views/auth.html',
        controller: 'AuthCtrl',
        controllerAs: 'auth'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
       $locationProvider.html5Mode(true);
  })
  .constant('authConfig', {
      disabled: false,
      clientId: '',
      clientSecret: '',
      redirectUri: 'http://localhost:9000'
    });


angular
  .module('energyArtApp').constant('apiBaseUrl', 'https://app.energimolnet.se/');
