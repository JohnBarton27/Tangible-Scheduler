'use strict';

//Skill requests service used to communicate Skill requests REST endpoints
angular.module('skill-requests').factory('SkillRequests', ['$resource',
	function($resource) {
		return $resource('skill-requests/:skillRequestId', { skillRequestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);