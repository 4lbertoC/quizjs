'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var QuizJsServer = require('../');

var qjs = new QuizJsServer();

var DEFAULT_PORT = 2450;

function registerPlayerActions(socket) {
	socket.on(QuizJsServer.ACTION.PLAYER.SUBSCRIBE, function(data) {
		console.log('QuizJs – Player ' + data.playerId + ' subscribed');
		qjs.subscribe(data.playerId);
	});
}

function registerMasterActions(socket) {
	socket.on(QuizJsServer.ACTION.MASTER.RESET, qjs.resetState);
	socket.on(QuizJsServer.ACTION.MASTER.NEXT, qjs.nextSubscriber);
}

io.sockets.on('connection', function(socket) {

	socket.on(QuizJsServer.ACTION.PLAYER.CONNECT, function() {
		registerPlayerActions(socket);

		var playerId = qjs.registerPlayer();
		
		console.log('QuizJs – Player ' + playerId + ' connected');
		socket.emit(QuizJsServer.EVENT.PLAYER.REGISTER, {
			playerId: playerId
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