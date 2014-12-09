'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			},
			addSkill: {
				method: 'PUT',
				url: 'users/skill/:userId/:skillId',
                params: {
                    userId: 'userId',
                    skillId: 'skillId'
                }
			},
            userByID: {
                method: 'GET',
                isArray: false,
                url: 'users/:id',
                params: {
                    id: 'id'
                }
            }
		});
	}
]);
