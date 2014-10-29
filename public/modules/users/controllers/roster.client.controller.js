'use strict';

angular.module('users').controller('RosterController', ['$scope',
	function($scope) {
		// Find a list of Users
		$scope.find = function() {
			$scope.users = Users.query();
		};
	}
                                                        
        // Find existing User
		$scope.findOne = function() {
			$scope.user = Users.get({ 
				userId: $stateParams.userId
			});
		};
]);