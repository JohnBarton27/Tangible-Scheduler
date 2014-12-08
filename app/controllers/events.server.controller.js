'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Event = mongoose.model('Event'),
	Project = mongoose.model('Project'),
	SkillRequest = mongoose.model('SkillRequest'),
	EventRequest = mongoose.model('EventRequest'),
	User = mongoose.model('User'),
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
				if(err)
				console.log('Error adding project:' + err);
			}
		);
	}
	
	event.save(function(err,newEvent) {
		//console.log('in create');
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			//
			// Weve Created an event, now create the event requests.
			//
			var i;
			for(i=0; i < skillRequests.length; i++){
				var skillRequest = new SkillRequest(skillRequests[i]);
				//save the request
				skillRequest.save(function(err2,srequest) {
					if (err2) {
						console.log('error saving skillRequest' + err2);
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err2)
						});
					} else {
						//console.log('request' + srequest);
						//update the event
						Event.findByIdAndUpdate(
							newEvent._id,
							{$push: {'skillsNeeded': srequest._id}},
							{safe: true, upsert: true},
							function(err3, model) {
								console.log('error finding event' + err3);
							}
						);

					}
				});
				/* 
				 * Create event-requests based on the skillrequest
				 * there is an event request given to a user for every numRequested in skillRequest.
				 */
				//setup to add required users	
				if(skillRequest.requiredUsers === undefined) {
					skillRequest.requiredUsers = [];
				}
				User
					.find()
					.where('skills').equals(skillRequest.skill)
					.where('_id').nin(skillRequest.requiredUsers)
					.sort('-created').exec(function(err, users) {
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							var userCount =0;
							for(var i=0; i < skillRequest.numRequested; i++) {
								//begin building event
								var eventRequest = new EventRequest();
								eventRequest.event = event._id;
								
								//add required users first
								if(skillRequest.requiredUsers[i]!=undefined) {
									eventRequest.user = skillRequest.requiredUsers[i];
								}
								else {
									//no more required users, lets find one
									if(users[userCount]){
										eventRequest.user = users[userCount];
										userCount++;
									}
								}
								//console.log(eventRequest);
								eventRequest.save(function(err3,srequest) {
									if (err3) {
										console.log('error saving eventRequest' + err3);
										return res.status(400).send({
											message: errorHandler.getErrorMessage(err3)
										});
									}
								});
							}
						}
					});		
			}
			//now that weve created the skills requests, use them to build event requests
			//start sending emails here?
			
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
exports.list = function(req, res) { Event.find().sort('-created').populate('user').populate('project').populate('requsers').exec(function(err, events) {
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
exports.eventByID = function(req, res, next, id) { Event.findById(id).populate('user').populate('skillsNeeded').populate('project').exec(function(err, event) {
		if (err) return next(err);
		if (! event) return next(new Error('Failed to load Event ' + id));
		//fill the skills and users inside skill-request objects
		SkillRequest.populate(event.skillsNeeded,'skill requiredUsers',function(err,doc){
			req.event = event;
			next();
		});
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



