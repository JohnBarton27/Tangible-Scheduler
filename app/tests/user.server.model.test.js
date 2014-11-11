'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * Globals
 */
var user, user2;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
	before(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			phone: '9546143525',
			provider: 'local'
		});
		user2 = new User({
			firstName: 'Full',
			lastName: 'Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			phon: '9546143525',
			provider: 'local'
		});

		done();
	});

	describe('Method Save', function() {
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});


		it('should be able to add admin', function(done) {
			user.roles = 'admin';
			return user.save(function(err) {
				should.not.exist(err);
				done();
			});
		});


		it('should be able to add normal user', function(done) {
			user.roles = 'user';
			return user.save(function(err) {
				should.not.exist(err);
				done();
			});
		});



		it('should be able to show an error when try to save without first name', function(done) {
			user.firstName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should be able to show an error when try to save without last name', function(done) {
			user.lastName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without phone number', function(done) {
			user.phone = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});


		it('should be able to show an error when try to save without password', function(done) {
			user.password = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});


		it('should be able to show an error when try to save without email', function(done) {
			user.email = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});


		it('should show an error when try to save with invalid email ', function(done) {
			user.email = 'bob.com';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});



	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});
