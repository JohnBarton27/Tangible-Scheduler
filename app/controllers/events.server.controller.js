'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Event = mongoose.model('Event'),
	Project = mongoose.model('Project'),
	SkillRequest = mongoose.model('SkillRequest'),
	_ = require('lodash');

/**
 * Create a Event
 */
exports.create = function(req, res) {
	var event = new Event(req.body);
	event.user = req.user;
	//create skill-requests
	var skillRequests = req.body.skills;
	//console.log(form);
	
	//if the event has a project also add it to the project
	if(event.project) {
		Project.findByIdAndUpdate(
			event.project,
			{$push: {'events': event}},
			{safe: true, upsert: true},
			function(err, model) {
				console.log(err);
			}
		);
	}
	
	event.save(function(err,newEvent) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var i;
			for(i=0; i < skillRequests.length; i++){
				var skillRequest = new SkillRequest({
					skill:		skillRequests[i].skillSet,
					isRequired: 	skillRequests[i].isRequired,
					users:		skillRequests[i].users,
				});
				skillRequest.save(function(err,srequest) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						console.log("ID: "+srequest._id);
						Event.findByIdAndUpdate(
							newEvent._id,
							{$push: {'skillsNeeded': srequest._id}},
							{safe: true, upsert: true},
							function(err, model) {
								console.log(err);
							}
						);

					}
				});
			}
			res.jsonp(event);
		}
	});
};

/**
 * Show the current Event
 */
exports.read = function(req, res) {
	res.jsonp(req.event);
};

/**
 * Update a Event
 */
exports.update = function(req, res) {
	var event = req.event ;

	event = _.extend(event , req.body);

	event.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(event);
		}
	});
};

/**
 * Delete an Event
 */
exports.delete = function(req, res) {
	var event = req.event ;

	event.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(event);
		}
	});
};

/**
 * List of Events
 */
exports.list = function(req, res) { Event.find().sort('-created').populate('user').populate('project').exec(function(err, events) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(events);
		}
	});
};

/**
 * Event middleware
 */
exports.eventByID = function(req, res, next, id) { Event.findById(id).populate('user').populate('skillsNeeded', 'users isRequired skill').populate('project').exec(function(err, event) {
		if (err) return next(err);
		if (! event) return next(new Error('Failed to load Event ' + id));
		//var i;
		//for(i=0; i < event.skillsNeeded.length; i++){
		//	var currentRequest = event.skillsNeeded[i];
		//	console.log('skill'+ currentRequest.skill);

			SkillRequest.populate(event.skillsNeeded,'skill users',function(err,doc){
				//event.skillsNeeded[i] = doc.skill; 
				console.log(event.skillsNeeded[0]);
				
				req.event = event;
				next();
			});

		//}				
		console.log('event: ' + event);
	});
};

/**
 * Event authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.event.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
