'use strict';


angular.module('core').controller('HomeController', ['$scope', '$stateParams', 'Authentication', 'Skillsets', 'Users',
	function($scope, $stateParams, Authentication, Skillsets, Users) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

        $scope.hasAuth = $scope.authentication.user._id !== undefined;
        
        // Find a list of Skillsets
		$scope.findSkillsets = function() {
			$scope.skillsets = Skillsets.query();
		};
        
        // Find a list of Users
		$scope.findUsers = function() {
			$scope.users = Users.query();
		};
        
	}
]);
