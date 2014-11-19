'use strict';

// Posts controller
angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Posts', 'Skillsets',
	function($scope, $stateParams, $location, Authentication, Posts, Skillsets ) {
		$scope.authentication = Authentication;

		// Create new Post
		$scope.create = function() {
			// Create new Post object
			var post = new Posts ({
				name: this.name,
				content: this.content,
				skill: this.skill
			});

			// Redirect after save
			post.$save(function(response) {
				$location.path('posts/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.content = '';
				$scope.skill = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Post
		$scope.remove = function( post ) {
			if ( post ) { post.$remove();

				for (var i in $scope.posts ) {
					if ($scope.posts [i] === post ) {
						$scope.posts.splice(i, 1);
					}
				}
			} else {
				$scope.post.$remove(function() {
					$location.path('posts');
				});
			}
		};

		// Update existing Post
		$scope.update = function() {
			var post = $scope.post ;

			post.$update(function() {
				$location.path('posts/' + post._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.isAdmin = function()
		{
			//console.log($scope.authentication.user.isAdmin);
			return $scope.authentication.user.isAdmin;
		};

		// Find a list of Posts
		$scope.find = function() {
			$scope.posts = Posts.query();
		};

		$scope.findSkills = function() {
			$scope.skills = Skillsets.query();
		};

		$scope.findBySkill = function(skillString) {
            $scope.posts = Posts.findBySkill({
                skillString: skillString
            });
		};

		// Find existing Post
		$scope.findOne = function() {
			$scope.post = Posts.get({ 
				postId: $stateParams.postId
			});
		};
	}
]);
