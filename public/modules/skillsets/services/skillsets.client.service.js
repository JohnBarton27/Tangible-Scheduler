'use strict';

//Skillsets service used to communicate Skillsets REST endpoints
angular.module('skillsets').factory('Skillsets', ['$resource',
	function($resource) {
		return $resource('skillsets/:skillsetId', { skillsetId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);