'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Skill request Schema
 */
var SkillRequestSchema = new Schema({
	skill: {
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Skillset'
	},
	minRequested: { 
		type: Number, 
		min: 1
	},
	requiredUsers:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}]

});

mongoose.model('SkillRequest', SkillRequestSchema);
