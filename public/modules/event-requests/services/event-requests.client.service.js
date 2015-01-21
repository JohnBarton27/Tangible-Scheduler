'use strict';

//Event requests service used to communicate Event requests REST endpoints
angular.module('event-requests').factory('EventRequests', ['$resource',
	function($resource) {
		return $resource('event-requests/:eventRequestId', {eventRequestId: '@_id'}, {
			update: {
				method: 'PUT',
                data: {},
                isArray: false
			}
		});
	}
]);