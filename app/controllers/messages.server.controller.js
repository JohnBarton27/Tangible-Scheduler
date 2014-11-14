'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Message = mongoose.model('Message'),
	_ = require('lodash');

/**
 * Create a Message
 */
exports.create = function(req, res) {
	var message = new Message(req.body);
	message.user = req.user;

	message.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(message);
		}
	});
};

/**
 * Show the current Message
 */
exports.read = function(req, res) {
	res.jsonp(req.message);
};

/**
 * Update a Message
 */
exports.update = function(req, res) {
	var message = req.message ;

	message = _.extend(message , req.body);

	message.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(message);
		}
	});
};

/**
 * Delete an Message
 */
exports.delete = function(req, res) {
	var message = req.message ;

	message.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(message);
		}
	});
};

/**
 * List of Messages
 */
exports.list = function(req, res) { Message.find().sort('-created').populate('user', 'displayName').exec(function(err, messages) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(messages);
		}
	});
};

/**
 * Message middleware
 */
exports.messageByID = function(req, res, next, id) { Message.findById(id).populate('user', 'displayName').exec(function(err, message) {
		if (err) return next(err);
		if (! message) return next(new Error('Failed to load Message ' + id));
		req.message = message ;
		next();
	});
};

/**
 * Message authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.message.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};