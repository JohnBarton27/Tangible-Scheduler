'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Message = mongoose.model('Message');

/**
 * Globals
 */
var userFrom, userTo, message;

/**
 * Unit tests
 */
describe('Message Model Unit Tests:', function() {
	beforeEach(function(done) {
		userFrom = new User({
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return message.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to send the message', function(dont) {
		})
	});

	afterEach(function(done) { 
		Message.remove().exec();
		User.remove().exec();

		done();
	});
});