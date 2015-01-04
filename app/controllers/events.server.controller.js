'use strict';


/**

 * Module dependencies.

 */

var mongoose = require('mongoose'),
<<<<<<< HEAD
	errorHandler = require('./errors'),
	Event = mongoose.model('Event'),
	Project = mongoose.model('Project'),
	_ = require('lodash');
=======

errorHandler = require('./errors'),

Event = mongoose.model('Event'),

Project = mongoose.model('Project'),

SkillRequest = mongoose.model('SkillRequest'),

EventRequest = mongoose.model('EventRequest'),

User = mongoose.model('User'),

nodemailer = require('nodemailer'),

_ = require('lodash');

>>>>>>> d0ac001b002df9edb1ee820c8e421952c7e307a8

/**

 * Create a Event

 */

exports.create = function(req, res) {
<<<<<<< HEAD

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

} 

else {

//console.log('request' + srequest);

//update the event

Event.findByIdAndUpdate(

newEvent._id,

{$push: {'skillsNeeded': srequest._id}},

{safe: true, upsert: true},

function(err3, model) {

if(err3)

console.log('error finding event' + err3);

}

);


/* 

* Create event-requests based on the skillrequest

* there is an event request given to a user for every numRequested in skillRequest.

*/

//setup to add required users

if(srequest.requiredUsers === undefined) {

srequest.requiredUsers = [];

}

User

.find()

.where('skills').equals(srequest.skill)

.where('_id').nin(srequest.requiredUsers)

.sort('-created').exec(function(err, users) {

if (err) {

return res.status(400).send({

message: errorHandler.getErrorMessage(err)

});

} else {

var userCount =0;

for(var i=0; i < srequest.numRequested; i++) {

//begin building event

var eventRequest = new EventRequest();

eventRequest.event = event._id;


//add required users first

if(srequest.requiredUsers[i]!==undefined) {

eventRequest.user = srequest.requiredUsers[i];

eventRequest.required = true;

}

else {

//no more required users, lets find one

if(users[userCount]){

eventRequest.user = users[userCount];

userCount++;

eventRequest.required = false;

}

}


//console.log(eventRequest);

eventRequest.save(function(err3,erequest) {

if (err3) {

console.log('error saving eventRequest' + err3);

return res.status(400).send({

message: errorHandler.getErrorMessage(err3)

});

}

else {


//get user for email info

User.findById(erequest.user, function(err, user) {

var transporter = nodemailer.createTransport({

service: 'Gmail',

auth: {

user: 'tangiblescheduler@gmail.com',

pass: 'tangible123'

}

});

var msgtext = 'You are requested for an event - ' + event.name + '\n Check it out at <a href="http://localhost:3333/#!/event-requests/'+erequest._id+'/edit">'+event.name+'</a>';

var msgto = '';


if ( user.phoneProvider === undefined || user.phoneProvider === 'none') {

msgto = user.email;

}

else if (user.phoneProvider.toLowerCase() === 'verizon') {

msgto = user.phone.replace(/^-/, '') + '@vtext.com';

}

else if (user.phoneProvider.toLowerCase() === 'att') {

msgto = user.phone.replace(/^-/, '') + '@txt.att.net';

}

else if (user.phoneProvider.toLowerCase() === 'tmobile') {

msgto = user.phone.replace(/^-/, '') + '@tmomail.net';

}

else if (user.phoneProvider.toLowerCase() === 'sprint') {

msgto = user.phone.replace(/^-/, '') + '@messaging.sprintpcs.com';

}


var mailOptions = {

from: 'tangibletesting@gmail.com',

to: msgto,

subject: 'Event Request',

text: msgtext

=======
	var event = new Event(req.body);
	event.user = req.user;
	
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
	
	event.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(event);
		}
	});
>>>>>>> b041106fdd53ce9d5797a9ad79ac85e3685e667c
};

transporter.sendMail(mailOptions, function(err, info) {

if (err) {

  console.log(err);

}

else {

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
<<<<<<< HEAD
exports.eventByID = function(req, res, next, id) { Event.findById(id).populate('user').populate('project').populate('requsers').exec(function(err, event) {
		if (err) return next(err);
		if (! event) return next(new Error('Failed to load Event ' + id));
		req.event = event ;
		next();
	});
=======

exports.eventByID = function(req, res, next, id) { Event.findById(id).populate('user').populate('skillsNeeded').populate('project').exec(function(err, event) {

if (err) return next(err);

if (! event) return next(new Error('Failed to load Event ' + id));

//fill the skills and users inside skill-request objects

SkillRequest.populate(event.skillsNeeded,'skill requiredUsers',function(err,doc){

req.event = event;

next();

});

});

>>>>>>> d0ac001b002df9edb1ee820c8e421952c7e307a8
};


/**

 * Event authorization middleware

 */

exports.hasAuthorization = function(req, res, next) {
<<<<<<< HEAD
	if (req.event.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
=======

if (req.event.user.id !== req.user.id) {

return res.status(403).send('User is not authorized');

}

next();

};

>>>>>>> d0ac001b002df9edb1ee820c8e421952c7e307a8
