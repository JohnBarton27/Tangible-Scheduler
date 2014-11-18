'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var skillRequests = require('../../app/controllers/skill-requests');

	// Skill requests Routes
	app.route('/skill-requests')
		.get(skillRequests.list)
		.post(users.requiresLogin, skillRequests.create);

	app.route('/skill-requests/:skillRequestId')
		.get(skillRequests.read)
		.put(users.requiresLogin, skillRequests.hasAuthorization, skillRequests.update)
		.delete(users.requiresLogin, skillRequests.hasAuthorization, skillRequests.delete);

	// Finish by binding the Skill request middleware
	app.param('skillRequestId', skillRequests.skillRequestByID);
};