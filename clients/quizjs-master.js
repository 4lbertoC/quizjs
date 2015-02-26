var CONST = require('../constants');
var io = require('socket.io-client');

var QuizJsMaster = function() {
	this._eventHandlers = {};
};

QuizJsMaster.prototype.connect = function(url) {
	var self = this;
	var socket = this._socket = io(url);

	socket.on('connect', function() {
		socket.emit(CONST.ACTION.MASTER.CONNECT);
	});

	socket.on(CONST.EVENT.MASTER.REGISTER, function(data) {
		self._connected = true;
		self._callEventHandlers(CONST.EVENT.MASTER.REGISTER, data);
	});

	socket.on(CONST.EVENT.STATE.UPDATE, function(data) {
		self._callEventHandlers(CONST.EVENT.STATE.UPDATE, data);
	});

	socket.on(CONST.EVENT.STATE.RESET, function(data) {
		self._callEventHandlers(CONST.EVENT.STATE.RESET, data);
	});
};

QuizJsMaster.prototype.next = function() {
	if (this._connected) {
		this._socket.emit(CONST.ACTION.MASTER.NEXT);
	} else {
		console.error('Master not connected!');
	}
};

QuizJsMaster.prototype.on = function(eventId, handler) {
	if (!this._eventHandlers[eventId]) {
		this._eventHandlers[eventId] = [];
	}

	this._eventHandlers[eventId].push(handler);
};

QuizJsMaster.prototype.reset = function() {
	if (this._connected) {
		this._socket.emit(CONST.ACTION.MASTER.RESET);
	} else {
		console.error('Master not connected!');
	}
};

QuizJsMaster.prototype._callEventHandlers = function(eventId, data) {
	var currentEventHandlers = this._eventHandlers[eventId];
	if (Array.isArray(currentEventHandlers)) {
		for (var i = 0, len = currentEventHandlers.length; i < len; i++) {
			currentEventHandlers[i](data);
		}
	}
};

QuizJsMaster.prototype._eventHandlers = null;

QuizJsMaster.prototype._connected = false;

QuizJsMaster.prototype._socket = null;

module.exports = QuizJsMaster;