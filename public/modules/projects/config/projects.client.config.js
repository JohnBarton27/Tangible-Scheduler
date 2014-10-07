/*
'use strict';

// Configuring the Articles module
angular.module('projects').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('Projects', 'Projects', 'projects', 'dropdown', '/projects(/create)?');
		Menus.addSubMenuItem('Projects', 'projects', 'List Projects', 'projects');
		Menus.addSubMenuItem('Projects', 'projects', 'New Project', 'projects/create');
	}
]);
*/
