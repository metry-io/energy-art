angular.module('energyArtApp')
  .config(function ($stateProvider){
	$stateProvider.state('main', {
	  abstract: true,
	  templateUrl: 'main/main.html',
	  onEnter: function($state, $window, emAuth){
	  	var code = getURLParameter('code');

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

// A regular-expression that returns the parameter 'name', code is taken from http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
// NOTE: There seemed to be some problems using Angular services caused by html5Mode
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}
