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
			firstName: 'Full',
			lastName: 'Name',
			email: 'juandis007@gmail.com',
			emailPassword: 
			phone: 
		});

		userTo = new User({
			firstName: 'Hot',
			lastName: 'Mail',
			email: 'juandis_007@hotmail.com',
			phone: '7589632156',
			password: 'passda'
		});

		userFrom.save(function() { 
		});
		userTo.save(function() {
		});

		message = new Message({
			from: userFrom._id,
			to: userTo._id,
			subject: 'TESTING',
			text: 'HOLY SHIT THIS IS A TEST'
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return message.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to send the message', function(dont) {
			var transporter = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: message.from.email,
					pass: message.from.emailPassword
				}
			});

			var mailOptions = {
				from: message.from.email,
				to: message.to.email,
				subject: message.subject,
				text: message.text
			};

			transporter.sendMail(mailOptions, function(err, info) {
				if (err) {
					console.log(err);
					done();
				}
				else {
					console.log('Message send: ' + info.response);
					done();
				}
			});
		})
	});

	afterEach(function(done) { 
		Message.remove().exec();
		User.remove().exec();

		done();
	});
});