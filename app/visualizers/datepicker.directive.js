angular.module('energyArtApp')
  .directive('glnDatepicker', function(){
  	return {
  		restrict: 'E',
  		templateUrl: 'visualizers/datepicker.tmpl.html'
  	}
  })