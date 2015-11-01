angular.module('energyArtApp')
	.directive('glnSidebar', function(){
		return {
			controller: 'sidebarCtrl',
			controllerAs: 'sidebar',
			bindToController: 'true',
			templateUrl: 'main/sidebar.tmpl.html'
		};
	});