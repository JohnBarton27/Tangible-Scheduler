'use strict';

angular.module('users').controller('create-user', ['$scope', '$http', '$location', 'Users', 'Authentication', 'Skillsets',
	function($scope, $http, $location, Users, Authentication, Skillsets) {
		$scope.authentication = Authentication;



		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {

				// And redirect to the roster page
				$location.path('/roster');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

				// Find a list of Skills
		$scope.findSkills = function() {
			$scope.skills = Skillsets.query();
		};
	}
]);