'use strict';

angular.module('users').controller('RosterController', ['$scope', 'Users',
	function($scope, Users) {
		// Find a list of Users
		$scope.findUsers = function() {
			$scope.users = Users.query();
		};       
	}
]);