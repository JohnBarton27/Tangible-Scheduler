var mongoose = require('mongoose');

var EventsSchema = new mongoose.Schema({
	name: String,
	description: String,
	date: String,
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Projects'
	},
	skillsNeeded: [{
		skill: String,
		required: Boolean,
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Users'
		}
	}]
});

var Events = mongoose.model('Events', EventsSchema);
console.log("Events collection created");
