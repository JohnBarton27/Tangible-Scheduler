'use strict';

// Event requests controller
angular.module('event-requests').controller('EventRequestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Events', 'EventRequests',
	function($scope, $stateParams, $location, Authentication, Events, EventRequests ) {
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
			var eventRequest = $scope.eventRequest;
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
        
        // Find a list of Events
		$scope.findEvents = function() {
			$scope.events = Events.query();
		};

		// Find existing Event request
		$scope.findOne = function() {
			$scope.eventRequest = EventRequests.get({ 
				eventRequestId: $stateParams.eventRequestId
			});
		};
        
        // Find existing Event request
		$scope.findById = function(id) {
			$scope.eventRequest = EventRequests.get({ 
				eventRequestId: id
			});
		};
        
        $scope.submitResponse = function(status, id) {
            $scope.eventRequest = EventRequests.get({ 
				eventRequestId: id
			});
            $scope.eventRequest.response = status;
            console.log($scope.eventRequest);
			//$scope.eventRequest.$update();
        }
        
        $scope.editResponse = function(id) {
            $location.path('event-requests/' + id);
        }
	}
]);