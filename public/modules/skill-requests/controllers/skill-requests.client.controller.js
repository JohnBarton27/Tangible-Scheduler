'use strict';

// Skill requests controller
angular.module('skill-requests').controller('SkillRequestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'SkillRequests',
	function($scope, $stateParams, $location, Authentication, SkillRequests ) {
		$scope.authentication = Authentication;

		// Create new Skill request
		$scope.create = function() {
			// Create new Skill request object
			var skillRequest = new SkillRequests ({
				name: this.name
			});

			// Redirect after save
			skillRequest.$save(function(response) {
				$location.path('skill-requests/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Skill request
		$scope.remove = function( skillRequest ) {
			if ( skillRequest ) { skillRequest.$remove();

				for (var i in $scope.skillRequests ) {
					if ($scope.skillRequests [i] === skillRequest ) {
						$scope.skillRequests.splice(i, 1);
					}
				}
			} else {
				$scope.skillRequest.$remove(function() {
					$location.path('skill-requests');
				});
			}
		};

		// Update existing Skill request
		$scope.update = function() {
			var skillRequest = $scope.skillRequest ;

			skillRequest.$update(function() {
				$location.path('skill-requests/' + skillRequest._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Skill requests
		$scope.find = function() {
			$scope.skillRequests = SkillRequests.query();
		};

		// Find existing Skill request
		$scope.findOne = function() {
			$scope.skillRequest = SkillRequests.get({ 
				skillRequestId: $stateParams.skillRequestId
			});
		};
	}
]);