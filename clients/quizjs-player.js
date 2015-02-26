var CONST = require('../constants');
var io = require('socket.io-client');

var QuizJsPlayer = function() {
	this._eventHandlers = {};
};

QuizJsPlayer.prototype.on = function(eventId, handler) {
	if (!this._eventHandlers[eventId]) {
		this._eventHandlers[eventId] = [];
	}

	this._eventHandlers[eventId].push(handler);
};

QuizJsPlayer.prototype.connect = function(url) {
	var self = this;
	var socket = this._socket = io(url);

	socket.on('connect', function() {
		socket.emit(CONST.ACTION.PLAYER.CONNECT);
	});

	socket.on(CONST.EVENT.PLAYER.REGISTER, function(data) {
		self._connected = true;
		self._playerId = data.playerId;
		self._callEventHandlers(CONST.EVENT.PLAYER.REGISTER, data);
	});

	socket.on(CONST.EVENT.STATE.UPDATE, function(data) {
		self._callEventHandlers(CONST.EVENT.STATE.UPDATE, data);
	});

	socket.on(CONST.EVENT.STATE.RESET, function(data) {
		self._callEventHandlers(CONST.EVENT.STATE.RESET, data);
	});
};

QuizJsPlayer.prototype.subscribe = function() {
	if (this._connected) {
		this._socket.emit(CONST.ACTION.PLAYER.SUBSCRIBE, {
			playerId: this._playerId
		});
	} else {
		console.error('Player not connected!');
	}
};

QuizJsPlayer.prototype._callEventHandlers = function(eventId, data) {
	var currentEventHandlers = this._eventHandlers[eventId];
	if (Array.isArray(currentEventHandlers)) {
		for (var i = 0, len = currentEventHandlers.length; i < len; i++) {
			currentEventHandlers[i](data);
		}
	}
};

QuizJsPlayer.prototype._socket = null;

QuizJsPlayer.prototype._connected = false;

QuizJsPlayer.prototype._eventHandlers = null;

QuizJsPlayer.prototype._playerId = undefined;

module.exports = QuizJsPlayer;