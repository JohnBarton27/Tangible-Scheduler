'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EventRequest = mongoose.model('EventRequest');

/**
 * Globals
 */
var user, eventRequest;

/**
 * Unit tests
 */
describe('Event request Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			eventRequest = new EventRequest({
				name: 'Event request Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return eventRequest.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		/*it('should be able to show an error when try to save without name', function(done) { 
			eventRequest.name = '';

			return eventRequest.save(function(err) {
				should.exist(err);
				done();
			});
		});*/
	});

	afterEach(function(done) { 
		EventRequest.remove().exec();
		User.remove().exec();

		done();
	});
});