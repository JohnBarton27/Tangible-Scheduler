'use strict';

angular.module('users').controller('RosterController', ['$scope', 'Users', 'Skillsets',
	function($scope, Users, Skillsets) {
		// Find a list of Users
		$scope.findUsers = function() {
			$scope.users = Users.query();
		};
        
        $scope.findSkills = function() {
            $scope.skills = Skillsets.query();
        };

        $scope.isAdmin = function()
        {
            //console.log($scope.authentication.user.isAdmin);
            return $scope.authentication.user.isAdmin;
        };
        
        
        $scope.addSkill = function(skillset) {
            var user = $scope.user;
            
            user.addSkill(skillset);
        };    
	}
]);