'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

/*
 * Events received by the clients.
 */
var ACTION = {
	CLIENT: {
		// Triggered when a client connects
		CONNECT: 'quizjs-client-connect',
		// Triggered when a client subscribes to a question
		SUBSCRIBE: 'quizjs-client-subscribe'
	},
	MASTER: {
		// Triggered when a master connects
		CONNECT: 'quizjs-master-connect',
		// Triggered when the master resets the state
		RESET: 'quizjs-master-reset',
		// Triggered when a client's answer was wrong and the master lets the next person answer
		NEXT: 'quizjs-master-next'
	}
};

/**
 * Events sent by the server.
 */
var EVENT = {
	CLIENT: {
		// Triggered when a client is registered to the server
		REGISTER: 'quizjs-client-register'
	},
	MASTER: {
		// Triggered when a client is registered to the server
		REGISTER: 'quizjs-master-register'
	},
	STATE: {
		RESET: 'quizjs-state-reset',
		UPDATE: 'quizjs-state-update'
	}
};

var DEFAULT_PORT = 2450;

var registeredIds = 0;
var clientQueue = [];

function registerClientActions(socket) {
	socket.on(ACTION.CLIENT.SUBSCRIBE, function(data) {
		var newSubscriptionId = data.clientId;

		if (clientQueue.indexOf(newSubscriptionId) === -1) {
			console.log('QuizJs – Client ' + newSubscriptionId + ' subscribed');
			clientQueue.push(newSubscriptionId);
			updateState();
		}
	});
}

function registerMasterActions(socket) {
	socket.on(ACTION.MASTER.RESET, function(data) {
		resetState();
	});

	socket.on(ACTION.MASTER.NEXT, function(data) {
		clientQueue.shift();
		updateState();
	});
}

function resetState() {
	clientQueue.length = 0;

	console.log('QuizJs – Reset');
	io.sockets.emit(EVENT.STATE.RESET, {});
}

function updateState() {
	// Can also be undefined
	var speakerId = clientQueue[0];
	var data = {
		speakerId: speakerId
	};

	console.log('QuizJs – Update: ' + speakerId + ' can answer');
	io.sockets.emit(EVENT.STATE.UPDATE, data);
}

io.sockets.on('connection', function(socket) {

	socket.on(ACTION.CLIENT.CONNECT, function() {
		registerClientActions(socket);

		var clientId = registeredIds++;
		console.log('QuizJs – Client ' + clientId + ' connected');
		socket.emit(EVENT.CLIENT.REGISTER, {
			clientId: clientId
		});
	});

	socket.on(ACTION.MASTER.CONNECT, function() {
		registerMasterActions(socket);

		console.log('QuizJs – Master connected');
		socket.emit(EVENT.MASTER.REGISTER, {});
	});

});

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', "*");
	res.setHeader('Access-Control-Allow-Credentials', "true");

	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	next();
});

app.set('port', (process.env.PORT || DEFAULT_PORT))

module.exports = function() {
	var port = app.get('port');
	server.listen(port);
	console.log('QuizJs – Server started on port ' + port);
};