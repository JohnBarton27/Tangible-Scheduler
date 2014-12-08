'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Event = mongoose.model('Event'),
	Project = mongoose.model('Project'),
	Skillset = mongoose.model('Skillset');

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

		it('should be able to save event without a project', function(done) { 
			event.project = null;

			return event.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('should be able to save event without skillset', function(done) { 
			event.skill = null;

			return event.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('should be able to save event without requsers', function(done) { 
			event.requsers = null;

			return event.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to save event with a project', function(done) { 
			event.project = new Project({
				name: 'Project Name',
				description: 'this is a project description',
				type:  'Type',
				//user: user
			});;

			return event.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('should be able to save event with a skillset', function(done) { 
			event.skill = new Skillset({
				skill: 'Skillset Name',
				user: user
			});

			return event.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('should be able to save event with requsers', function(done) { 
			event.requsers = user;

			return event.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('should be able to add created time for an event', function(done) { 
			event.created = Date.now();

			return event.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to set hasHappened for a project', function(done) { 
			event.hasHappened = true;

			return event.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to add a user to a project', function(done) { 
			event.user = user;

			return event.save(function(err) {
				should.not.exist(err);
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

		describe('Method Find', function() {
		it('should be able to find evenets without problems', function(done) {
			return Event.find(function(err) {
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
