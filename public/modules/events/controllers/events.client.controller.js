'use strict';

/*
 * getSkills will take the result of the submitted form from Event.create()
 * It will parse the data from form and turn bring together the users, skills and whether theyre required or not into skill-request objects.
 *
 * Model:
 * skillsNeeded [{
	 * skillset: refercnce _id to a skill,
	 * isRequired: boolean for is the skillset requied,
	 * users[{user._id}] is an array of userIds to reference
 * }]
 */
function getSkills(form){
	var skills = [];
	var skillsChosen = form.skill;
	var i;
	for(i=0; i < skillsChosen.length; i++){
		var skill = {};
		/*
		 * This needs to be modified by front-end. take whatever your forms submit and form skill-request objects.
		 */
		skill.skillSet = skillsChosen[i];
		skill.isRequired = true;
		skill.users = [form.requsers[0]];
		skills.push(skill);
	}
	return skills;
}

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$filter', '$stateParams', '$location', 'Authentication', 'Events','Projects','Skillsets','SkillRequests','Users',
	function($scope, $filter, $stateParams, $location, Authentication, Events, Projects, Skillsets, SkillRequests, Users ) {
        
		$scope.authentication = Authentication;
        
		//Date
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth()+1;
        var curr_year = d.getFullYear();

        $scope.dateToday = Date.parse(curr_month + '/' + curr_date + '/' + curr_year);
        
        $scope.eventDateFilter = function() {
            $scope.dateRange = $scope.dateToday;
        };

		// Create new Event
		$scope.create = function() {
			var chosenSkills = getSkills(this);	
			console.log(chosenSkills);
			// Create new Event object
			var event = new Events ({
				name:           this.name,
                description:    this.description,
                date:           this.date,
                time:           this.time,
                location:       this.location,
				project:		this.project,
				skills:			chosenSkills,
				skillsNeeded:   this.skillRequestIds
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
                $scope.project = '';
                $scope.skill = '';
                $scope.requsers = '';
                $scope.dateRange = ''; 
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

		$scope.isAdmin = function()
		{
			//console.log($scope.authentication.user.isAdmin);
			return $scope.authentication.user.isAdmin;
		};

		// Find a list of Events
		$scope.find = function() {
			$scope.events = Events.query();
		};
		// Find a list of Projects
		$scope.findProjects = function() {
			$scope.projects = Projects.query();
		};
		
		// Find a list of Skills
		$scope.findSkills = function() {
			$scope.skills = Skillsets.query();
		};


		// Find a list of Users
		$scope.findUsers = function() {
			$scope.users = Users.query();
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
