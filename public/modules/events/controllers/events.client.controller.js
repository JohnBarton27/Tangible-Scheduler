'use strict';

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Events','Projects',
	function($scope, $stateParams, $location, Authentication, Events, Projects ) {
		$scope.authentication = Authentication;
		//$scope.projects = Projects.query();
		// Create new Event
		$scope.create = function() {
		
		console.log($scope);
		// Create new Event object
			var event = new Events ({
				name:           this.name,
                description:    this.description,
                date:           this.date,
                time:           this.time,
                location:       this.location,
				project:		this.project
			});

			// Redirect after save
			event.$save(function(response) {
				$location.path('events/' + response._id);

				// Clear form fields
				$scope.name = '';
                $scope.description = '';
                $scope.date = '';
                $scope.time = '';
                $scope.location = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Event
		$scope.remove = function( event ) {
			if ( event ) { event.$remove();

				for (var i in $scope.events ) {
					if ($scope.events [i] === event ) {
						$scope.events.splice(i, 1);
					}
				}
			} else {
				$scope.event.$remove(function() {
					$location.path('events');
				});
			}
		};

		// Update existing Event
		$scope.update = function() {
			var event = $scope.event ;

			event.$update(function() {
				$location.path('events/' + event._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Events
		$scope.find = function() {
			$scope.events = Events.query();
		};
		// Find a list of Events
		$scope.findProjects = function() {
			$scope.projects = Projects.query();
		};


		// Find existing Event
		$scope.findOne = function() {
			$scope.event = Events.get({ 
				eventId: $stateParams.eventId
			});
		};
	}
]);
