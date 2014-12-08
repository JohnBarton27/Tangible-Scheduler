'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
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
