'use strict';

angular
  .module('energyArtApp')
  .constant('twitterConfig', {
    "client_id": "7d254c4ef598b65",
    "client_secret": "d65d9a63a5f2288a58355aa873aaa78f6e907753"
  });

angular
  .module('energyArtApp')
  .constant('authConfig', {
    privateToken: '08161b27d332aeaa6f922bb795e65b3f2bb6bd840fde3cf1735d03113af6'
  });

/*
angular
  .module('energyArtApp')
    .constant('authConfig', {
       disabled: false,
       clientId: 'energy_art',
       clientSecret: 'jg09zs8f43hlrgr8thhieiwsf8hhsg89389ssh',
       redirectUri: 'http://energy-art.se'
    });


*/
