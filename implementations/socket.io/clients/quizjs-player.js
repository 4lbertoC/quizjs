var CONST = require('../../../constants');
var io = require('socket.io-client');
var events = require('events');

/**
 * @constructor
 * @fires QuizJsPlayer#EVENT.PLAYER.REGISTER
 * @fires QuizJsPlayer#EVENT.STATE.UPDATE
 * @fires QuizJsPlayer#EVENT.STATE.RESET
 */
var QuizJsPlayer = function() {
	this._emitter = new events.EventEmitter();
};

/**
 * Connects to the socket.io server.
 *
 * @param {string} url The address to connect to
 */
QuizJsPlayer.prototype.connect = function(url) {
	var self = this;
	var socket = this._socket = io(url);

	socket.on('connect', function() {
		socket.emit(CONST.ACTION.PLAYER.CONNECT);
	});

	socket.on(CONST.EVENT.PLAYER.REGISTER, function(data) {
		self._connected = true;
		self._playerId = data.playerId;
		self._emitter.emit(CONST.EVENT.PLAYER.REGISTER, data);
	});

	socket.on(CONST.EVENT.STATE.UPDATE, function(data) {
		self._emitter.emit(CONST.EVENT.STATE.UPDATE, data);
	});

	socket.on(CONST.EVENT.STATE.RESET, function(data) {
		self._emitter.emit(CONST.EVENT.STATE.RESET, data);
	});
};

/**
 * Subscribes the player to the current question.
 */
QuizJsPlayer.prototype.subscribe = function() {
	if (this._connected) {
		this._socket.emit(CONST.ACTION.PLAYER.SUBSCRIBE, {
			playerId: this._playerId
		});
	} else {
		console.error('Player not connected!');
	}
};

QuizJsPlayer.prototype._socket = null;

QuizJsPlayer.prototype._connected = false;

QuizJsPlayer.prototype._playerId = undefined;

QuizJsPlayer.prototype._emitter = null;

QuizJsPlayer.prototype.on = function() {
    this._emitter.on.apply(this._emitter, arguments);
};

QuizJsPlayer.prototype.once = function() {
    this._emitter.once.apply(this._emitter, arguments);
};

QuizJsPlayer.prototype.removeListener = function() {
    this._emitter.removeListener.apply(this._emitter, arguments);
};

QuizJsPlayer.prototype.removeAllListener = function() {
    this._emitter.removeAllListeners.apply(this._emitter, arguments);
};

QuizJsPlayer.ACTION = CONST.ACTION;

QuizJsPlayer.EVENT = CONST.EVENT;

module.exports = QuizJsPlayer;