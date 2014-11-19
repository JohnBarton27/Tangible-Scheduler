'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var skillsets = require('../../app/controllers/skillsets');

	// Skillsets Routes
	app.route('/skillsets')
		.get(users.requiresLogin, skillsets.list)
		.post(users.requiresLogin, skillsets.create);

	app.route('/skillsets/:skillsetId')
		.get(users.requiresLogin, skillsets.read)
		.put(users.requiresLogin, skillsets.hasAuthorization, skillsets.update)
		.delete(users.requiresLogin, skillsets.hasAuthorization, skillsets.delete);

	// Finish by binding the Skillset middleware
	app.param('skillsetId', skillsets.skillsetByID);
};
