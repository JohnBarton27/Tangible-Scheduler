'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
	name: {
		type: String,
		required: 'Please include Project name',
		trim: true
	},
	desription: {
		type: String,
		required: 'Please include Project description',
		trim: true
	},
	dueDate: Date,
	events: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event'
	}],
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Project', ProjectSchema);
console.log('Project collection created');
