'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Event request Schema
 */
var EventRequestSchema = new Schema({
	response: {
		type: String,
		default: '',
	},
	created: {
		type: Date,
		default: Date.now
	},
	event: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event'
	},
	users:[{
		type: Schema.ObjectId,
		ref: 'User'
	}]
});

mongoose.model('EventRequest', EventRequestSchema);
