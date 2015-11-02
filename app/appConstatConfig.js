'use strict';

angular
  .module('energyArtApp')
    .constant('authConfig', {
      disabled: false,
      clientId: 'energy_art',
      clientSecret: 'jg09zs8f43hlrgr8thhieiwsf8hhsg89389ssh',
      redirectUri: 'http://energy-art.se'
    });
