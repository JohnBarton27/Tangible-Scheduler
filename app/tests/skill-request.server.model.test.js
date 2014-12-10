'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	SkillRequest = mongoose.model('SkillRequest');

/**
 * Globals
 */
var user, skillRequest;

/**
 * Unit tests
 */
describe('Skill request Model Unit Tests:', function() {
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
			skillRequest = new SkillRequest({
				name: 'Skill request Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return skillRequest.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			skillRequest.name = '';

			return skillRequest.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		SkillRequest.remove().exec();
		User.remove().exec();

		done();
	});
});