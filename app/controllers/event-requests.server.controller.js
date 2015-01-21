'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	EventRequest = mongoose.model('EventRequest'),
	SkillRequest = mongoose.model('SkillRequest'),
	_ = require('lodash');

/**
 * Create a Event request
 */
exports.create = function(req, res) {
var eventRequest = new EventRequest(req.body);
	eventRequest.user = req.user;

	eventRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(eventRequest);
		}
	});
};

/**
 * Show the current Event request
 */
exports.read = function(req, res) {
	res.jsonp(req.eventRequest);
};

/**
 * Update a Event request
 */
exports.update = function(req, res) {
	console.log("HERE");
    console.log("REQ: " + req + " RES: " + res);
    var eventRequest = req.eventRequest ;
    console.log(eventRequest);
	eventRequest = _.extend(eventRequest , req.body);

	eventRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(eventRequest);
		}
	});
};

/**
 * Delete an Event request
 */
exports.delete = function(req, res) {
	var eventRequest = req.eventRequest ;

	eventRequest.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(eventRequest);
		}
	});
};

/**
 * List of Event requests
 */
exports.list = function(req, res) { EventRequest.find().sort('-created').populate('user', 'displayName').exec(function(err, eventRequests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(eventRequests);
		}
	});
};

/**
 * Event request middleware
 */
exports.eventRequestByID = function(req, res, next, id) { EventRequest.findById(id).populate('event').populate('user').exec(function(err, eventRequest) {
		if (err) return next(err);
		if (! eventRequest) return next(new Error('Failed to load Event request ' + id));
		eventRequest.skillsNeeded = eventRequest.event.skillsNeeded;
		SkillRequest.populate(eventRequest.event.skillsNeeded,'skill requiredUsers',function(err,doc){
			console.log(doc);
			req.eventRequest = eventRequest;
			next();
		});
	});
};

/**
 * Event request authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.eventRequest.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
