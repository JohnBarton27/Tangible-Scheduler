/*
'use strict';

// Configuring the Articles module
angular.module('events').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('Events', 'Events', 'events', 'dropdown', '/events(/create)?');
		Menus.addSubMenuItem('Events', 'events', 'List Events', 'events');
		Menus.addSubMenuItem('Events', 'events', 'New Event', 'events/create');
	}
]);
*/
