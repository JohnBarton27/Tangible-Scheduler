'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Skillset Schema
 */
var SkillsetSchema = new Schema({
	skill: {
		type: String,
		default: '',
		required: 'Please fill skill.',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
	});

mongoose.model('Skillset', SkillsetSchema);
