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
nodemailer = require('nodemailer'),
_ = require('lodash');


/**
 * Create an Event
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
                if(err) {
                    console.log('Error adding project:' + err);
                }
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
            // We've created an event, now create the event requests.
            //
			
			//Start by grabbing the required users
			var srequests = [];
			var reqUsers = [];
			var sskills = [];
			//Have to make an extra version of sskills array cause js is stupid and Im getting different types
			var sskillz = [];
			
			for(var i=0; i < skillRequests.length; i++){
				srequests.push(new SkillRequest(skillRequests[i]));
				if(srequests[i].requiredUsers !== undefined) {
					for(var j=0; j < srequests[i].requiredUsers.length; j++) {
						if(reqUsers.indexOf(srequests[i].requiredUsers[j]) === -1) {
							reqUsers.push(srequests[i].requiredUsers[j]);
						}
					}
				}
				sskills.push(srequests[i].skill);
				sskillz.push(srequests[i].skill.toString());
			}
			
			User
			.find()
			.where('_id').in(reqUsers)
			.sort('-created').exec(function(err, rUsers) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					console.log("-------rUsers----------");
					console.log(rUsers);
					var skillRequestUsers = {};
					for(var i=0; i < sskills.length; i++) {
						skillRequestUsers[sskills[i]] = [];
					}
					
					console.log("---------sskills---------");
					console.log(sskills);
					
					
					//Loop through each required user and each of their skills
					for(var i=0; i < rUsers.length; i++) {
						var rUser = rUsers[i];
						for(var j=0; j < rUser.skills.length; j++) {
							if(sskillz.indexOf(rUser.skills[j].toString()) !== -1) {
								//Add the user to the list of users to attach to the skill request
								skillRequestUsers[rUser.skills[j]].push(rUser);
							} else {
								console.log("Required User - Not a skill we are looking for");
							}
						}
					}
					
					console.log("-----------skillRequestUsers------------");
					console.log(skillRequestUsers);
					
					User
					.find()
					.where('skills').in(sskills)
					.where('_id').nin(reqUsers)
					.sort('-created').exec(function(err, oUsers) {
						if(err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							console.log("----------oUsers---------");
							console.log(oUsers);
							
							//create a skills we have dictionary for counting the number of each skill we have
							//create a skills diff dictionary for storing the number of each skill we have minus
							//the number of each skill we want
							var skillzHave = {};
							var skillzDiff = {};
							var skillUsers = {};
							var skillzWant = {};
							
							for(var i=0; i < sskills.length; i++) {
								skillzHave[sskills[i]] = 0;
								skillUsers[sskills[i]] = [];
								skillzWant[sskills[i]] = srequests[i].numRequested;
							}
							
							console.log("--------------------skillzWant---------------------");
							console.log(skillzWant);
							
							//Loop through each user and each of their skills
							for(var i=0; i < oUsers.length; i++) {
								var oUser = oUsers[i];
								for(var j=0; j < oUser.skills.length; j++) {
									if(sskillz.indexOf(oUser.skills[j].toString()) !== -1) {
										//Add 1 to the count for that skill
										skillzHave[oUser.skills[j]]++;
										//Add the user to the list of users with that skill
										skillUsers[oUser.skills[j]].push(oUser);
									} else {
										console.log("Ambig User - Not a skill we are looking for");
									}
								}
							}
							
							console.log("-----------skillUsers---------");
							console.log(skillUsers);
							
							var totalRequested = 0;
							
							for(var i=0; i < sskills.length; i++) {
								var skl = sskills[i];
								skillzDiff[skl] = skillzHave[skl] - srequests[i].numRequested;
								totalRequested += srequests[i].numRequested;
							}
							
							//Should eventually make skillzDiff an AVL tree so this doesn't take like O(N^2)
							
							// Create skillzDiff array
							var skillsDiff = Object.keys(skillzDiff).map(function(key) {
								return [key, skillzDiff[key]];
							});
							
							while(skillsDiff.length > 0) {
								//Stuff for sorting skillzDiff dictionary based on value.
								// Sort the array based on the second element
								skillsDiff.sort(function(first, second) {
									return first[1] - second[1];
								});
								
								console.log("-------skillsDiff--------");
								console.log(skillsDiff);
								
								var skil = skillsDiff[0][0];
								
								//Once we have gotten the number of people we wanted, remove skill from sorted diff array
								if(skillzWant[skil] === 0) {
									skillsDiff.splice(0, 1);
									continue;
								}
								
								while(skillUsers[skil].length > 0) {
									var rand = Math.floor((Math.random() * skillUsers[skil].length));
									var skillUser = skillUsers[skil][rand];
									var userIndex = oUsers.indexOf(skillUser);
									
									skillUsers[skil].splice(rand, 1);
									if(userIndex !== -1) {
										skillRequestUsers[skil].push(skillUser);
										oUsers.splice(userIndex, 1);
										skillzWant[skil]--;
										break;
									} else if(skillUsers[skil].length === 0) {
										skillzWant[skil] = 0;
									}
								}
								
								console.log("---------skillRequestUsers--------");
								console.log(skillRequestUsers);
							}
							
							
							var rqUsers = [];
							var allUsers = [];
							var usrSkills = [];
							for(var l=0; l < sskills.length; l++) {
								var skkill = sskills[l];
								for(var j=0; j < skillRequestUsers[skkill].length; j++) {
									var usIndex = allUsers.indexOf(skillRequestUsers[skkill][j]);
									if(usIndex === -1) {
										allUsers.push(skillRequestUsers[skkill][j]);
										usrSkills.push(skkill);
									}
									if(srequests[l].requiredUsers.indexOf(skillRequestUsers[skkill][j]._id) !== -1) {
										rqUsers.push(skillRequestUsers[skkill][j]);
									}
								}
							}
							
							for(var i=0; i < skillRequests.length; i++){
								var skillRequest = new SkillRequest(skillRequests[i]);

								//save the request
								skillRequest.save(function(err2,srequest) {
									if (err2) {
										console.log('error saving skillRequest' + err2);
										return res.status(400).send({
											message: errorHandler.getErrorMessage(err2)
										});
									} else {
										var skilll = srequest.skill;
										
										//console.log('request' + srequest);
										//update the event
										Event.findByIdAndUpdate(
											newEvent._id,
											{$push: {'skillsNeeded': srequest._id}},
											{safe: true, upsert: true},
											function(err3, model) {
												if(err3) {
													console.log('error finding event' + err3);
												}
											}
										);

										/* 
										* Create event-requests based on the skillrequest
										* there is an event request given to a user for every numRequested in skillRequest.
										*/

										//setup to add required users

										//if(srequest.requiredUsers === undefined) {
										//	srequest.requiredUsers = [];
										//}
									}
								});
							}	
							
							console.log(oUsers);
							console.log(allUsers);
							for(var i=0; i < allUsers.length; i++) {
								//begin building event request
								var eventRequest = new EventRequest();
								eventRequest.event = event._id;
								eventRequest.skill = usrSkills[i];

								//add required users first
								eventRequest.user = allUsers[i];
								if(rqUsers.indexOf(allUsers[i]) === -1) {
									eventRequest.required = false;
								} else {
									eventRequest.required = true;
								}
 
								console.log("------------event-request----------------");
								console.log(eventRequest);
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

											var msgtext = '\nYou are requested for an event - ' + event.name + '. Check it out at http://tangiblescheduler.com/#!/event-requests/'+erequest._id;
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
						}
					});
                }
            });
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
 * Update an Event
 */

exports.update = function(req, res) {
    var event = req.event;
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