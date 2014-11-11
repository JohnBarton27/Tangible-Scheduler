'use strict';

//Setting up route
angular.module('skillsets').config(['$stateProvider',
	function($stateProvider) {
		// Skillsets state routing
		$stateProvider.
		state('listSkillsets', {
			url: '/skillsets',
			templateUrl: 'modules/skillsets/views/list-skillsets.client.view.html'
		}).
		state('createSkillset', {
			url: '/skillsets/create',
			templateUrl: 'modules/skillsets/views/create-skillset.client.view.html'
		}).
		state('viewSkillset', {
			url: '/skillsets/:skillsetId',
			templateUrl: 'modules/skillsets/views/view-skillset.client.view.html'
		}).
		state('editSkillset', {
			url: '/skillsets/:skillsetId/edit',
			templateUrl: 'modules/skillsets/views/edit-skillset.client.view.html'
		});
	}
]);