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
		type: String,
		default: '',
		required: 'Please specifiy message sender',
		trim: true
	},
	to: {
		type: String,
		default: '',
		required: 'Please specifiy message recipient',
		trim: true
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
	}
});

mongoose.model('Message', MessageSchema);