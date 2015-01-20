'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'Users',
	function($scope, $http, $location, Authentication, Users) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');
        
        $scope.findUsers = function() {
			$scope.users = Users.query();
		};
        
		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
                
				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				if (response.isAdmin) {
                    response.roles = ['admin'];
                } else {
                    response.roles = ['user'];
                }
                $scope.authentication.user = response;
                
                // And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);