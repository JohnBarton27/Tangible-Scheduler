'use strict';

//Posts service used to communicate Posts REST endpoints
angular.module('posts').factory('Posts', ['$resource',
	function($resource) {
		return $resource('posts/:postId', { postId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            findBySkill: {
                method: 'GET',
                url: 'posts/skill/:skillString',
                params: {
                    skillString: 'skillString'
                },
                isArray: true
            }
		});
	}
]);
