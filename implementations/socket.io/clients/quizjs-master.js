var CONST = require('../../../constants');
var io = require('socket.io-client');
var events = require('events');

/**
 * @constructor
 */
var QuizJsMaster = function() {
	this._emitter = new events.EventEmitter();
};

/**
 * Connects to the socket.io server.
 *
 * @param {string} url The address to connect to
 * @fires QuizJsMaster#EVENT.MASTER.REGISTER
 */
QuizJsMaster.prototype.connect = function(url) {
	var self = this;
	var socket = this._socket = io(url);

	socket.on('connect', function() {
		socket.emit(CONST.ACTION.MASTER.CONNECT);
	});

	socket.on(CONST.EVENT.MASTER.REGISTER, function(data) {
		self._connected = true;
		self._emitter.emit(CONST.EVENT.MASTER.REGISTER, data);
	});

	socket.on(CONST.EVENT.STATE.UPDATE, function(data) {
		self._emitter.emit(CONST.EVENT.STATE.UPDATE, data);
	});

	socket.on(CONST.EVENT.STATE.RESET, function(data) {
		self._emitter.emit(CONST.EVENT.STATE.RESET, data);
	});
};

/**
 * Passes the turn to the next subscriber in the queue.
 *
 * @fires QuizJsMaster#EVENT.STATE.UPDATE
 */
QuizJsMaster.prototype.next = function() {
	if (this._connected) {
		this._socket.emit(CONST.ACTION.MASTER.NEXT);
	} else {
		console.error('Master not connected!');
	}
};

/**
 * Resets the quiz state.
 *
 * @fires QuizJsMaster#EVENT.STATE.RESET
 */
QuizJsMaster.prototype.reset = function() {
	if (this._connected) {
		this._socket.emit(CONST.ACTION.MASTER.RESET);
	} else {
		console.error('Master not connected!');
	}
};

QuizJsMaster.prototype._connected = false;

QuizJsMaster.prototype._socket = null;

QuizJsMaster.prototype._emitter = null;

QuizJsMaster.prototype.on = function() {
    this._emitter.on.apply(this._emitter, arguments);
};

QuizJsMaster.prototype.once = function() {
    this._emitter.once.apply(this._emitter, arguments);
};

QuizJsMaster.prototype.removeListener = function() {
    this._emitter.removeListener.apply(this._emitter, arguments);
};

QuizJsMaster.prototype.removeAllListener = function() {
    this._emitter.removeAllListeners.apply(this._emitter, arguments);
};

QuizJsMaster.ACTION = CONST.ACTION;

QuizJsMaster.EVENT = CONST.EVENT;

module.exports = QuizJsMaster;