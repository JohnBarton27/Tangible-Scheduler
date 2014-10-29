'use strict';

// Configuring the Articles module
angular.module('skillsets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Skillsets', 'skillsets', 'dropdown', '/skillsets(/create)?');
		Menus.addSubMenuItem('topbar', 'skillsets', 'List Skillsets', 'skillsets');
		Menus.addSubMenuItem('topbar', 'skillsets', 'New Skillset', 'skillsets/create');
	}
]);