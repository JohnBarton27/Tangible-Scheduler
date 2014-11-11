'use strict';

//Setting up route
angular.module('event-requests').config(['$stateProvider',
	function($stateProvider) {
		// Event requests state routing
		$stateProvider.
		state('listEventRequests', {
			url: '/event-requests',
			templateUrl: 'modules/event-requests/views/list-event-requests.client.view.html'
		}).
		state('createEventRequest', {
			url: '/event-requests/create',
			templateUrl: 'modules/event-requests/views/create-event-request.client.view.html'
		}).
		state('viewEventRequest', {
			url: '/event-requests/:eventRequestId',
			templateUrl: 'modules/event-requests/views/view-event-request.client.view.html'
		}).
		state('editEventRequest', {
			url: '/event-requests/:eventRequestId/edit',
			templateUrl: 'modules/event-requests/views/edit-event-request.client.view.html'
		});
	}
]);