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
    'angular-spinkit'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  });


angular
  .module('energyArtApp').constant('apiBaseUrl', 'https://app.energimolnet.se/');