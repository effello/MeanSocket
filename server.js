'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk'),
    net = require('net');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Create Socket Server
var count = 1;

var SocketServer = net.createServer( function(socket){
	socket.on('data', function(data){
		var dataString = ''+data;
		if(count>0){
			//socket.write('1');
			//console.log(''+count+' times got '+ data);
			app.set('WinCCData', data);
			count = count +1;
		}else{
			//socket.write('0');
		}
	});
});

SocketServer.listen(5000);

// Start the app by listening on <port>
// app.listen(config.port);
app.get('server').listen(config.port);
var socket = require('./app/controllers/socket.server.controller');
var io = app.get('socketio');

io.on('connection', socket.onConnect);
app.set('WinCCData', []);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
