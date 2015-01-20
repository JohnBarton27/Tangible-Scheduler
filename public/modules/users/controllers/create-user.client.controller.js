'use strict';

angular.module('users').controller('create-user', ['$scope', '$http', '$location', 'Users', 'Authentication', 'Skillsets',
	function($scope, $http, $location, Users, Authentication, Skillsets) {
		$scope.authentication = Authentication;



		$scope.createuser = function() {
			$http.post('/auth/createuser', $scope.credentials).success(function(response) {
                
                console.log("PRE-CHANGE: " + $scope.credentials);
                
                if ($scope.credentials.isAdmin) {
                    $scope.credentials.roles = ['admin'];
                } else {
                    $scope.credentials.roles = ['user'];
                }
                
                console.log("POST-CHANGE: " + $scope.credentials);
                
				// And redirect to the roster page
				$location.path('/roster');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.isAdmin = function()
		{
			//console.log($scope.authentication.user.isAdmin);
			return $scope.authentication.user.isAdmin;
		};

				// Find a list of Skills
		$scope.findSkills = function() {
			$scope.skills = Skillsets.query();
		};
	}
]);