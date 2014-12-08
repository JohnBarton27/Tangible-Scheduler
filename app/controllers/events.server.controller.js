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
	nodemailer = require('nodemailer'),
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
					} 
					else {
						//console.log('request' + srequest);
						//update the event
						Event.findByIdAndUpdate(
							newEvent._id,
							{$push: {'skillsNeeded': srequest._id}},
							{safe: true, upsert: true},
							function(err, model) {
								console.log('error finding event' + err);
							}
						);

						//Create Event Requests for required users
						//Case where there are no required users
						if (srequest.requiredUsers.length == 0) {
							var usedUsersID = [];
							//count how many users available with requested skill
							Users.count({'skills': srequest.skill}, function(err, c) {
								if (err) {
									console.log('Error');
								}
								else {
									for (var j = 0; j < srequest.numRequested; j++) {
										Users.findOne({'skills': srequest.skill}, null, {skip: Math.floor(Math.random()*c)}, function(err, use) {
											if (err) {
												console.log('Error');
											}
											else {
												//check if user has already been used
												var skip = false;
												for (var k = 0; k < usedUsersID.length; k++) {
													//User has already been used
													if (usedUsersID[k] == use._id) {
														j--;
														skip = true;
														break;
													}
												}

												if (skip) {
													continue;
												}
												else {
													usedUsersID[j] = use._id;
													var EReq = new EventRequest({
														event: newEvent,
														user: use
													});
													EReq.save(function(err, newER) {
														if (err) {
															console.log("Error");
														}
														else {
															var transporter = nodemailer.createTransport({
															    service: 'Gmail',
															    auth: {
															        user: 'tangibletesting@gmail.com',
															        pass: '$tangibletesting123'
															    }
															});

															var msgtext = 'You '.concat('are requested to appear
																at ', newEvent.name, '. Please respond to this email
																with your attending status.');
															var mailOptions = {
															    from: 'tangibletesting@gmail.com',
															    to: newER.user.email,
															    subject: 'Event Request',
															    text: msgtext
															};

															transporter.sendMail(mailOptions, function(err, info) {
															    if (err) {
															           console.log(err);
															    }
															    else {
															          console.log('Message send: ' + info.response);
															    }
															});
														}
													});
												}
											}
										});
									}
								}
							});
						}
						//Case where there are requried users
						else {
							//Make and mail each event request for the required users
							var usedUsersID = [];
							for (var j = 0; j < srequest.requiredUsers.length; j++) {
								Users.findById(srequest.requiredUsers[j]._id, function(err, fuser) {
									if (err) {
										console.log('Error');
									}
									else {
										usedUsersID[usedUsersID.length] = fuser._id;
										var EReq = new EventRequest({
											event: newEvent,
											user: fuser
										});
										EReq.save(function(err, newER) {
											if (err) {
												console.log("Error");
											}
											else {
												var transporter = nodemailer.createTransport({
												    service: 'Gmail',
												    auth: {
												        user: 'tangibletesting@gmail.com',
												        pass: 'tangibletesting123'
												    }
												});

												var msgtext = 'You '.concat('are requested to appear
													at ', newEvent.name, '. Please respond to this email
													with your attending status.');
												var mailOptions = {
												    from: 'tangibletesting@gmail.com',
												    to: newER.user.email,
												    subject: 'Event Request',
												    text: msgtext
												};

												transporter.sendMail(mailOptions, function(err, info) {
												    if (err) {
												           console.log(err);
												    }
												    else {
												          console.log('Message send: ' + info.response);
												    }
												});
											}
										});
									}
								})
							}
							//now go back and do the random amount of users left
							Users.count({'skills': srequest.skill}, function(err, c) {
								if (err) {
									console.log('Error');
								}
								else {
									for (var j = 0; j < srequest.numRequested - usedUsersID.length; j++) {
										Users.findOne({'skills': srequest.skill}, null, {skip: Math.floor(Math.random()*c)}, function(err, use) {
											if (err) {
												console.log('Error');
											}
											else {
												//check if user has already been used
												var skip = false;
												for (var k = 0; k < usedUsersID.length; k++) {
													//User has already been used
													if (usedUsersID[k] == use._id) {
														j--;
														skip = true;
														break;
													}
												}

												if (skip) {
													continue;
												}
												else {
													usedUsersID[usedUsersID.length] = use._id;
													var EReq = new EventRequest({
														event: newEvent,
														user: use
													});
													EReq.save(function(err, newER) {
														if (err) {
															console.log("Error");
														}
														else {
															var transporter = nodemailer.createTransport({
															    service: 'Gmail',
															    auth: {
															        user: 'tangibletesting@gmail.com',
															        pass: 'tangibletesting123'
															    }
															});

															var msgtext = 'You '.concat('are requested to appear
																at ', newEvent.name, '. Please respond to this email
																with your attending status.');
															var mailOptions = {
															    from: 'tangibletesting@gmail.com',
															    to: newER.user.email,
															    subject: 'Event Request',
															    text: msgtext
															};

															transporter.sendMail(mailOptions, function(err, info) {
															    if (err) {
															           console.log(err);
															    }
															    else {
															          console.log('Message send: ' + info.response);
															    }
															});
														}
													});
												}
											}
										});
									}
								}
							});
						}
					}
				});
			}
			

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
exports.eventByID = function(req, res, next, id) { Event.findById(id).populate('user').populate('skillsNeeded', 'users isRequired skill').populate('project').exec(function(err, event) {
		if (err) return next(err);
		if (! event) return next(new Error('Failed to load Event ' + id));
		//fill the skills and users inside skill-request objects
		SkillRequest.populate(event.skillsNeeded,'skill users',function(err,doc){
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
