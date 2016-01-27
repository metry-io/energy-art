'use strict';

/**
 * @ngdoc service
 * @name energyArtApp.d3Service
 * @description
 * # d3Service
 * Factory in the energyArtApp.
 */

//By using dependecy injection, we can keep our global namespace clean and can inject our dependencies like normal.

angular.module('d3', [])
  .factory('d3Service', function ($q, $document, $rootScope) {
    var d = $q.defer();
    function onScriptLoad() {
      // Load client in the browser
      $rootScope.$apply(function() { d.resolve(window.d3); });
    }
    // Create a script tag with d3 as the source
    // and call our onScriptLoad callback when it
    // has been loaded
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.13/d3.js';
    scriptTag.onreadystatechange = function () {
    if (this.readyState === 'complete') { onScriptLoad(); }
  };
  scriptTag.onload = onScriptLoad;

  var s = $document[0].getElementsByTagName('body')[0];
  s.appendChild(scriptTag);

  return {
    d3: function() { return d.promise; }
  };
  });
