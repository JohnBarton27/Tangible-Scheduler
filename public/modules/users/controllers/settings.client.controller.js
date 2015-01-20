'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$stateParams', '$location', 'Users', 'Skillsets', 'Authentication',
	function($scope, $http, $stateParams, $location, Users, Skillsets, Authentication) {
        
        $scope.user = Authentication.user;
        
		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateCurrentUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};
		
		$scope.getUsers = function() {
		};
		
		$scope.getUserForEdit = function() {
			Users.query(function(response) {	//Not ideal
				for(var i = 0; i < response.length; i++)
				{
					if(response[i]._id === $stateParams.userId)
					{
						/*$scope.edituser = {
                            email: response[i].email,
                            firstName: response[i].firstName, 
                            lastName: response[i].lastName,
                            isAdmin: response[i].isAdmin, 
                            phone1: response[i].phone1,
							phone2: response[i].phone2,
							phone3: response[i].phone3,
                            roles: response[i].roles,
                            skills: response[i].skills,
                            phoneProvider: response[i].phoneProvider,
                            _id: response[i]._id
                        };*/
                        
                        $scope.edituser = response[i];
                        
                        if (response[i].isAdmin) {
                            $scope.edituser.roles = ['admin'];
                        } else {
                            $scope.edituser.roles = ['user'];
                        };
                        
                        //console.log("RESPONSE: " + $scope.edituser);
					}
				}
			});
			/* This should work but it doesnt
			 * Users.get({ _id: $stateParams.userId },function(response) {
			 *	$scope.edituser = response;
			 *});*/
			
		};
		
		//Update user profile, not the current user
		$scope.updateOtherUserProfile = function(isValid) {
            
            if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.edituser);

                
				user.$update(function(response) {
					$scope.success = true;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		
        };
        
		$scope.findSkills = function() {
			$scope.skills = Skillsets.query();
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
