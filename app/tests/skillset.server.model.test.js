'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Skillset = mongoose.model('Skillset');

/**
 * Globals
 */
var user, skillset;

/**
 * Unit tests
 */
describe('Skillset Model Unit Tests:', function() {
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
			skillset = new Skillset({
				skill: 'Skillset Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return skillset.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			skillset.skill = '';

			return skillset.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	describe('Method Update', function() {
		it('should be able to update without problems', function(done) {
			return skillset.update(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	describe('Method Remove', function() {
		it('should be able to remove without problems', function(done) {
			return skillset.remove(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Skillset.remove().exec();
		User.remove().exec();

		done();
	});
});