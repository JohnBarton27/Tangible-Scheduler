var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	phone: String,
	events: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Events'
	}],
	skills: [String],
	role: [String]
});

var Users = mongoose.model('Users', UserSchema);
console.log("Users collection created");