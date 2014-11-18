'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageSchema = new Schema({
	from: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	to: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	subject: {
		type: String,
		default: '',
		required: 'Please fill in message subject',
		trim: true
	},
	text: {
		type: String,
		default: '',
		required: 'Please fill in message text',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	sent: {
		type: Date
	}
});

mongoose.model('Message', MessageSchema);