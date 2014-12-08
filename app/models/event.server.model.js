'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please include an Event name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please include an Event description',
		trim: true
	},
	date: {
		type: String,
		required: 'Please include Event date'
	},
    time: {
        type: String,
        required: 'Please include a start time',
        trim: true
    },
    location: {
        type: String,
        required: 'Please include a location',
        trim: true
    },
    project: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
	},
	skillsNeeded: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'SkillRequest'
	}],
	created: {
		type: Date,
		default: Date.now
	},
	usersAttending: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Event', EventSchema);
console.log('Event collection created');
