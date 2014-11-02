'use strict';

angular.module('users').controller('create-user', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;



		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				//$scope.authentication.user = response;

				// And redirect to the index page
				//$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);