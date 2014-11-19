'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var posts = require('../../app/controllers/posts');

	// Posts Routes
	app.route('/posts')
		.get(users.requiresLogin, posts.list)
		.post(users.requiresLogin, posts.create);

    app.route('/posts/skill/:skillString')
		.get(users.requiresLogin, posts.read)
		.put(users.requiresLogin, posts.hasAuthorization, posts.update);


	app.route('/posts/:postId')
		.get(users.requiresLogin, posts.read)
		.put(users.requiresLogin, posts.hasAuthorization, posts.update)
		.delete(users.requiresLogin, posts.hasAuthorization, posts.delete);

	// Finish by binding the Post middleware
	app.param('postId', posts.postByID);
    app.param('skillString', posts.postBySkill);
};
