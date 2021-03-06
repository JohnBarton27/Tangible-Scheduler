'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Event = mongoose.model('Event'),
	Skillset = mongoose.model('Skillset');

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

		it('should show an error when try to save with an already used email ', function(done) {
			user.save();
			user2.email = 'test@test.com';
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

		it('should show error is trying to change users salt', function(done) {
			user.salt = 'test';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to add provider to a user', function(done) {
			user.provider = 'test';
			return user.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to set isAdmin for a user', function(done) {
			user.isAdmin = true;
			return user.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to add created time for a user', function(done) {
			user.created = Date.now();
			return user.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to add isUpdated time for a user', function(done) {
			user.updated =  Date.now();
			return user.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to resetPasswordToken for a user', function(done) {
			user.resetPasswordToken = 'test';
			return user.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to add resetPassworedExpires time for a user', function(done) {
			user.resetPassworedExpires =  Date.now();
			return user.save(function(err) {
				should.not.exist(err);
				done();
			});
		});


		it('should be able to add an event to a user', function(done) {
			user.events = new Event({
				name: 'Event Name',
				description: 'this is a test description',
				date: new Date(),
                time: '10:00 AM',
                location: 'this is a test location',
				user: user
			});
			return user.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

	it('should be able to add a skill to a user', function(done) {
			user.skills = new Skillset({
				skill: 'Skillset Name',
				user: user
			});
			return user.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

	});

	describe('Method Find', function() {
		it('should be able to find users without problems', function(done) {
			return User.find(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});
