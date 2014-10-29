'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var eventRequests = require('../../app/controllers/event-requests');

	// Event requests Routes
	app.route('/event-requests')
		.get(eventRequests.list)
		.post(users.requiresLogin, eventRequests.create);

	app.route('/event-requests/:eventRequestId')
		.get(eventRequests.read)
		.put(users.requiresLogin, eventRequests.hasAuthorization, eventRequests.update)
		.delete(users.requiresLogin, eventRequests.hasAuthorization, eventRequests.delete);

	// Finish by binding the Event request middleware
	app.param('eventRequestId', eventRequests.eventRequestByID);
};