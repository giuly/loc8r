var mongoose = require('mongoose');
var dbURI = 'mongodb://admin:test@ds157702.mlab.com:57702/loc8r';
var gracefulShutDown;

if(process.env.NODE_ENV === 'production'){
	dbURI = process.env.MONGOLAB_URI;
}


console.log('db-uriiiiiiiiiiiiiiiiiiiiiiiiii');
console.log(mongoose);

mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
	console.log('Mongooose connecetd to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
});

var gracefulShutDown = function(msg, callback) {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through ' + msg);
		callback();
	})
}

process.once('SIGUSR2', function() {
	gracefulShutDown('nodemon restart', function() {
		process.kill(process.pid, 'SIGUSR2');
	})
}) ;

process.on('SIGINT', function() {
	gracefulShutDown('app termination', function() {
		process.exit(0);
	})
});

require('./locations');
require('./users');