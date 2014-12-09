'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Project = mongoose.model('Project'),
	Event = mongoose.model('Event');

/**
 * Globals
 */
var user, project;

/**
 * Unit tests
 */
describe('Project Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			project = new Project({
				name: 'Project Name',
				description: 'this is a project description',
				type:  'Type',
				//user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return project.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			project.name = '';

			return project.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should show an error when try to save without description', function(done) { 
			project.description = '';

			return project.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without type', function(done) { 
			project.type = '';

			return project.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to add created time for a project', function(done) { 
			project.created = Date.now();

			return project.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to add a dueDate time for a project', function(done) { 
			project.dueDate = Date.now();

			return project.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to add an event to a user', function(done) {
			project.events = new Event({
				name: 'Event Name',
				description: 'this is a test description',
				date: new Date(),
                time: '10:00 AM',
                location: 'this is a test location',
				user: user
			});
			return project.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});	
	describe('Method Update', function() {
		it('should be able to update without problems', function(done) {
			return project.update(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	describe('Method Remove', function() {
		it('should be able to remove without problems', function(done) {
			return project.remove(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	describe('Method Find', function() {
		it('should be able to find project without problems', function(done) {
			return Project.find(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Project.remove().exec();
		User.remove().exec();

		done();
	});
});
