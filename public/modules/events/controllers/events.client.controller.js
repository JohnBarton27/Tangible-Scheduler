'use strict';

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$filter', '$stateParams', '$location', 'Authentication', 'Events','Projects',
	function($scope, $filter, $stateParams, $location, Authentication, Events, Projects ) {
		$scope.authentication = Authentication;
		//$scope.projects = Projects.query();
		// Create new Event
		$scope.create = function() {
		
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
    
        //Calendar Controller
        $scope.today = function() {
            $scope.date = new Date();
        };
        
        $scope.today();

        $scope.clear = function () {
            $scope.date = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
  
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd/MMMM/yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'MM/dd/yyyy', 'shortDate'];
        $scope.format = $scope.formats[3];        
        
        $scope.mytime = new Date();

		$scope.hstep = 1;
		$scope.mstep = 1;
		$scope.time = $filter('date')($scope.mytime, 'shortTime');


		$scope.ismeridian = true;
		$scope.timeChanged = function () {
			$scope.time = $filter('date')($scope.mytime, 'shortTime');
		};
}]);
