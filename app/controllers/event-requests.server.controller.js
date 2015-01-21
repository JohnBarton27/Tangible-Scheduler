'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	EventRequest = mongoose.model('EventRequest'),
	SkillRequest = mongoose.model('SkillRequest'),
	User = mongoose.model('User'),
	nodemailer = require('nodemailer'),
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
 * Update an Event request
 */
exports.update = function(req, res) {
	var eventRequest = req.eventRequest ;
    console.log(eventRequest);
	eventRequest = _.extend(eventRequest , req.body);
	
	eventRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if(eventRequest.required === false && eventRequest.response === 'no') {
				EventRequest
				.find()
				.where('event').equals(eventRequest.event)
				.sort('-created').exec(function(err, eventReqs) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						
						var allUsers = [];
						
						for(var i=0; i < eventReqs.length; i++) {
							allUsers.push(eventReqs.user._id);
						}
						
						User
						.find()
						.where('skills').in(eventRequest.skillRequest.skill)
						.where('_id').nin(allUsers)
						.sort('-created').exec(function(err, oUsers) {
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								
								var rand = Math.floor((Math.random() * oUsers.length));
												
								//begin building event request
								var newEventRequest = new EventRequest();
								newEventRequest.event = eventRequest.event;
								
								eventRequest.user = allUsers[i];
					 
								eventRequest.save(function(err3,erequest) {
									if (err3) {
										console.log('error saving eventRequest' + err3);
										return res.status(400).send({
											message: errorHandler.getErrorMessage(err3)
										});
									} else {
										//get user for email info
										User.findById(erequest.user, function(err, user) {
											var transporter = nodemailer.createTransport({
												service: 'Gmail',
												auth: {
													user: 'tangiblescheduler@gmail.com',
													pass: 'tangible123'
												}
											});

											var msgtext = 'You are requested for an event - ' + event.name + '. Check it out at http://tangiblescheduler.com/#!/event-requests/'+erequest._id;
											var msgto = '';
											var fullPhone = user.phone1 + user.phone2 + user.phone3;

											if ( user.phoneProvider === undefined || user.phoneProvider === 'none') {
												msgto = user.email;
											} else if (user.phoneProvider.toLowerCase() === 'verizon') {
												msgto = fullPhone + '@vtext.com';
											} else if (user.phoneProvider.toLowerCase() === 'att') {
												msgto = fullPhone + '@txt.att.net';
											} else if (user.phoneProvider.toLowerCase() === 'tmobile') {
												msgto = fullPhone + '@tmomail.net';
											} else if (user.phoneProvider.toLowerCase() === 'sprint') {
												msgto = fullPhone + '@messaging.sprintpcs.com';
											}

											var mailOptions = {
												from: 'tangibletesting@gmail.com',
												to: msgto,
												subject: 'Event Request',
												text: msgtext
											};

											transporter.sendMail(mailOptions, function(err, info) {
												if (err) {
													console.log(err);
												} else {
													console.log('Message send: ' + info.response);
												}
											});
											transporter.close();
										});
									}
								});
							}
						});
					}
				});
			}
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
