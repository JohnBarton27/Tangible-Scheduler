'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Event = mongoose.model('Event');

/**
 * Globals
 */
var user, event;

/**
 * Unit tests
 */
describe('Event Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			event = new Event({
				name: 'Event Name',
				description: 'this is a test description',
				date: new Date(),
                time: '10:00 AM',
                location: 'this is a test location',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return event.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			event.name = '';

			return event.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should show an error when try to save without description', function(done) { 
			event.description = '';

			return event.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should show an error when try to save without event date', function(done) { 
			event.date = '';

			return event.save(function(err) {
				should.exist(err);
				done();
			});
		});

	it('should show an error when try to save without event time', function(done) { 
			event.time = '';

			return event.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should show an error when try to save without event location', function(done) { 
			event.location = '';

			return event.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

		describe('Method Update', function() {
		it('should be able to update without problems', function(done) {
			return event.update(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

		describe('Method Remove', function() {
		it('should be able to remove without problems', function(done) {
			return event.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

	});

	afterEach(function(done) { 
		Event.remove().exec();
		User.remove().exec();

		done();
	});
});
