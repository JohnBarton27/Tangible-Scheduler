'use strict';

//Setting up route
angular.module('skill-requests').config(['$stateProvider',
	function($stateProvider) {
		// Skill requests state routing
		$stateProvider.
		state('listSkillRequests', {
			url: '/skill-requests',
			templateUrl: 'modules/skill-requests/views/list-skill-requests.client.view.html'
		}).
		state('createSkillRequest', {
			url: '/skill-requests/create',
			templateUrl: 'modules/skill-requests/views/create-skill-request.client.view.html'
		}).
		state('viewSkillRequest', {
			url: '/skill-requests/:skillRequestId',
			templateUrl: 'modules/skill-requests/views/view-skill-request.client.view.html'
		}).
		state('editSkillRequest', {
			url: '/skill-requests/:skillRequestId/edit',
			templateUrl: 'modules/skill-requests/views/edit-skill-request.client.view.html'
		});
	}
]);