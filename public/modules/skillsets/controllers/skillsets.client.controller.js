'use strict';

// Skillsets controller
angular.module('skillsets').controller('SkillsetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Skillsets', 'Users', 'Posts',
	function($scope, $stateParams, $location, Authentication, Skillsets, Users, Posts ) {
		$scope.authentication = Authentication;

		// Create new Skillset
		$scope.create = function() {
			// Create new Skillset object
			var skillset = new Skillsets ({
				skill: this.skill
			});

			// Redirect after save
			skillset.$save(function(response) {
				$location.path('skillsets/' + response._id);

				// Clear form fields
				$scope.skill = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Skillset
		$scope.remove = function( skillset ) {
			if ( skillset ) { skillset.$remove();

				for (var i in $scope.skillsets ) {
					if ($scope.skillsets [i] === skillset ) {
						$scope.skillsets.splice(i, 1);
					}
				}
			} else {
				$scope.skillset.$remove(function() {
					$location.path('skillsets');
				});
			}
		};

		// Update existing Skillset
		$scope.update = function() {
			var skillset = $scope.skillset ;

			skillset.$update(function() {
				$location.path('skillsets/' + skillset._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.isAdmin = function()
		{
			//console.log($scope.authentication.user.isAdmin);
			return $scope.authentication.user.isAdmin;
		};

		// Find a list of Skillsets
		$scope.find = function() {
			$scope.skillsets = Skillsets.query();
		};

		// Find existing Skillset
		$scope.findOne = function() {
			$scope.skillset = Skillsets.get({ 
				skillsetId: $stateParams.skillsetId
			});
		};

        // Find a list of Users
		$scope.findUsers = function() {
			$scope.users = Users.query();
		};
        
        // Find a list of Posts
		$scope.findPosts = function() {
			$scope.posts = Posts.query();
		};
        
        $scope.addSkill = function(skillset) {
            var user = $scope.user;
            
            user.addSkill(skillset);
        };
        
        $scope.addSkillToUser = function(skillset,user) {
            user.addSkill(skillset);
        };
              
 	}
]);
