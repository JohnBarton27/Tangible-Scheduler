'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Skillset = mongoose.model('Skillset'),
	_ = require('lodash');

/**
 * Create a Skillset
 */
exports.create = function(req, res) {
	var skillset = new Skillset(req.body);
	skillset.user = req.user;

	skillset.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(skillset);
		}
	});
};

/**
 * Show the current Skillset
 */
exports.read = function(req, res) {
	res.jsonp(req.skillset);
};

/**
 * Update a Skillset
 */
exports.update = function(req, res) {
	var skillset = req.skillset ;

	skillset = _.extend(skillset , req.body);

	skillset.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(skillset);
		}
	});
};

/**
 * Delete an Skillset
 */
exports.delete = function(req, res) {
	var skillset = req.skillset ;

	skillset.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(skillset);
		}
	});
};

/**
 * List of Skillsets
 */
exports.list = function(req, res) { Skillset.find().sort('-created').populate('user', 'displayName').exec(function(err, skillsets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(skillsets);
		}
	});
};

/**
 * Skillset middleware
 */
exports.skillsetByID = function(req, res, next, id) { Skillset.findById(id).populate('user', 'displayName').exec(function(err, skillset) {
		if (err) return next(err);
		if (! skillset) return next(new Error('Failed to load Skillset ' + id));
		req.skillset = skillset ;
		next();
	});
};

/**
 * Skillset authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.skillset.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};