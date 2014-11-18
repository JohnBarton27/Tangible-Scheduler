'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	SkillRequest = mongoose.model('SkillRequest'),
	_ = require('lodash');

/**
 * Create a Skill request
 */
exports.create = function(req, res) {
	var skillRequest = new SkillRequest(req.body);
	skillRequest.user = req.user;

	skillRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(skillRequest);
		}
	});
};

/**
 * Show the current Skill request
 */
exports.read = function(req, res) {
	res.jsonp(req.skillRequest);
};

/**
 * Update a Skill request
 */
exports.update = function(req, res) {
	var skillRequest = req.skillRequest ;

	skillRequest = _.extend(skillRequest , req.body);

	skillRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(skillRequest);
		}
	});
};

/**
 * Delete an Skill request
 */
exports.delete = function(req, res) {
	var skillRequest = req.skillRequest ;

	skillRequest.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(skillRequest);
		}
	});
};

/**
 * List of Skill requests
 */
exports.list = function(req, res) { SkillRequest.find().sort('-created').populate('user', 'displayName').exec(function(err, skillRequests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(skillRequests);
		}
	});
};

/**
 * Skill request middleware
 */
exports.skillRequestByID = function(req, res, next, id) { SkillRequest.findById(id).populate('user', 'displayName').exec(function(err, skillRequest) {
		if (err) return next(err);
		if (! skillRequest) return next(new Error('Failed to load Skill request ' + id));
		req.skillRequest = skillRequest ;
		next();
	});
};

/**
 * Skill request authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.skillRequest.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};