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
    'twitterShare',
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
    'd3',
    'ui.select'
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
  function (auth, config) {
    if (config.privateToken != undefined) auth.setPrivateToken(config.privateToken);
  }
]);


//Make sure that we track errors on ui-router
angular.module('energyArtApp').run(['$rootScope', '$state', 'emAuth',
  function ($rootScope, $state, emAuth) {

    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, err) {
      var code = getURLParameter('code');

      if (!emAuth.isAuthenticated() && code == null || code == "") {
        $state.go('auth');
      }
      else if (!emAuth.isAuthenticated() && code !== "") {
        emAuth.handleAuthCode(code).then(function () {
          $state.go('sidebar');
        });
      }

    });
  }]);


// A regular-expression that returns the parameter 'name', code is taken from http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
// NOTE: There seemed to be some problems using Angular services caused by html5Mode
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}
