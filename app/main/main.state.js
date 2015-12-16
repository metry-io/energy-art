angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider.state('main', {
	  abstract: true,
	  templateUrl: 'main/main.html',
	  onEnter: function($state, $window, emAuth){
	  	var code = ($window.location.search.replace("?code=", "")).replace("&state=emAuth","");

	  	if(!emAuth.isAuthenticated() && code == ""){
	  		$state.go('auth');
	  	}
	  	else if(!emAuth.isAuthenticated() && code !== ""){
	  		console.log(emAuth.isAuthenticated());
	  		emAuth.handleAuthCode(code).then(function(){
	  			$state.reload();
	  		});
	  	}
	  }
  })
});
