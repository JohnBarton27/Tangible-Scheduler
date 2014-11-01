'use strict';

angular.module('users').controller('CreateUserController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users',
	function($scope) {
		
		$scope.create = function() {

			var user = new Users ({
				firstName:   this.firstName,
                lastName:    this.lastName,
                phone:       this.phone,
                email:       this.email,
                skills:      this.skills,
			});

			// Redirect after save
			user.$save(function(response) {
				$location.path('users/' + response._id);

				// Clear form fields
				$scope.firstName = '';
                $scope.lastName = '';
                $scope.date = '';
                $scope.phone = '';
                $scope.email = '';
                $scope.skills = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing user
		$scope.remove = function( users ) {
			if ( user ) { user.$remove();

				for (var i in $scope.users ) {
					if ($scope.users [i] === user ) {
						$scope.users.splice(i, 1);
					}
				}
			} else {
				$scope.user.$remove(function() {
					$location.path('users');
				});
			}
		};

		// Update existing user
		$scope.update = function() {
			var user = $scope.user ;

			user.$update(function() {
				$location.path('users/' + user._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


	}
]);