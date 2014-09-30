var mongoose = require('mongoose');

var ProjectsSchema = new mongoose.Schema({
	name: String,
	description: String,
	dueDate: String,
	events: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Events'
	}]
});

var Projects = mongoose.model('Projects', ProjectsSchema);
console.log("Projects collection created");