'use strict';

angular.module('users').controller('RosterController', ['$scope', '$stateParams', '$location', 'Authentication', 'Events','Projects','Skillsets','Users',
	function($scope) {
		// Find a list of Users
		$scope.findUsers = function() {
			$scope.users = Users.query();
		};
	}
]);