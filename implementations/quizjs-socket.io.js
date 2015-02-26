'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var QuizJsServer = require('../');

var qjs = new QuizJsServer();

var DEFAULT_PORT = 2450;

function registerClientActions(socket) {
	socket.on(QuizJsServer.ACTION.CLIENT.SUBSCRIBE, function(data) {
		console.log('QuizJs – Client ' + data.clientId + ' subscribed');
		qjs.subscribe(data.clientId);
	});
}

function registerMasterActions(socket) {
	socket.on(QuizJsServer.ACTION.MASTER.RESET, qjs.resetState);
	socket.on(QuizJsServer.ACTION.MASTER.NEXT, qjs.nextSubscriber);
}

io.sockets.on('connection', function(socket) {

	socket.on(QuizJsServer.ACTION.CLIENT.CONNECT, function() {
		registerClientActions(socket);

		var clientId = qjs.registerClient();
		
		console.log('QuizJs – Client ' + clientId + ' connected');
		socket.emit(QuizJsServer.EVENT.CLIENT.REGISTER, {
			clientId: clientId
		});
	});

	socket.on(QuizJsServer.ACTION.MASTER.CONNECT, function() {
		registerMasterActions(socket);

		console.log('QuizJs – Master connected');
		socket.emit(QuizJsServer.EVENT.MASTER.REGISTER, {});
	});

});

qjs.on(QuizJsServer.EVENT.STATE.UPDATE, function(data) {
	console.log('QuizJs – Update: ' + data.speakerId + ' can answer');
	io.sockets.emit(QuizJsServer.EVENT.STATE.UPDATE, data);
});

qjs.on(QuizJsServer.EVENT.STATE.RESET, function(data) {
	console.log('QuizJs – Reset');
	io.sockets.emit(QuizJsServer.EVENT.STATE.RESET, data);
});

var port = process.env.PORT || DEFAULT_PORT;
app.set('port', port);
server.listen(port);
console.log('QuizJs – Server started on port ' + port);