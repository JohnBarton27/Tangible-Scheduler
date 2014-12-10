'use strict';

// Event requests controller
angular.module('event-requests').controller('EventRequestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'EventRequests',
	function($scope, $stateParams, $location, Authentication, EventRequests ) {
		$scope.authentication = Authentication;

		// Create new Event request
		$scope.create = function() {
			// Create new Event request object
			var eventRequest = new EventRequests ({
				response: this.response
			});

			// Redirect after save
			eventRequest.$save(function(response) {
				$location.path('event-requests/' + response._id);

				// Clear form fields
				$scope.response = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Event request
		$scope.remove = function( eventRequest ) {
			if ( eventRequest ) { eventRequest.$remove();

				for (var i in $scope.eventRequests ) {
					if ($scope.eventRequests [i] === eventRequest ) {
						$scope.eventRequests.splice(i, 1);
					}
				}
			} else {
				$scope.eventRequest.$remove(function() {
					$location.path('event-requests');
				});
			}
		};

		// Update existing Event request
		$scope.update = function() {
			var eventRequest = $scope.eventRequest ;
            console.log(eventRequest);
			eventRequest.$update(function() {
				$location.path('event-requests/' + eventRequest._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Event requests
		$scope.find = function() {
			$scope.eventRequests = EventRequests.query();
		};

		// Find existing Event request
		$scope.findOne = function() {
			$scope.eventRequest = EventRequests.get({ 
				eventRequestId: $stateParams.eventRequestId
			});
		};
	}
]);