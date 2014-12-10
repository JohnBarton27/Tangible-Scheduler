'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	Agenda = require('agenda'),
	path = require('path'),
	mongoose = require('mongoose');

/**
 * Agenda Scheduling entry file.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('\x1b[31m', 'Could not connect to MongoDB!');
		console.log(err);
	}
});

// Globbing model files
config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
	require(path.resolve(modelPath));
});



var agenda = new Agenda();
agenda.database(db.connection.host + ':' + db.connection.port + '/' + db.connection.name,'agendaJobs');

// Globbing model files
config.getGlobbedFiles('./app/jobs/**/*.js').forEach(function(modelPath) {
	require(path.resolve(modelPath))(agenda);
});

//require('./app/jobs/event.jobs.server.js')(agenda);

agenda.start();

// Logging initialization
console.log('Agenda Scheduler Started... ');
