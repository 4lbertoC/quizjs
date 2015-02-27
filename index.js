/*!
 * QuizJs Server
 *
 * Copyright (c) Alberto Congiu
 * @4lbertoC
 *
 * Released under the MIT license.
 */

'use strict';

var events = require('events');

var CONST = require('./constants');

/**
 * @constructor
 */
var QuizJsServer = function() {
    this._playerQueue = [];
    this._emitter = new events.EventEmitter();
};

/**
 * Passes the turn to the next subscriber in the queue.
 */
QuizJsServer.prototype.nextSubscriber = function() {
    this._playerQueue.shift();
    this._updateState();
};

/**
 * Registers a new player to the QuizJs server.
 *
 * @fires QuizJsServer#EVENT.PLAYER.REGISTER
 * @return {number} The new player's ID
 */
QuizJsServer.prototype.registerPlayer = function() {
    var playerId = this._registeredIds++;

    this._emitter.emit(CONST.EVENT.PLAYER.REGISTER, {
        playerId: playerId
    });

    return playerId;
};

/**
 * Empties the current subscriber queue and allows all
 * the players to subscribe for a new question.
 *
 * @fires QuizJsServer#EVENT.STATE.RESET
 */
QuizJsServer.prototype.resetState = function() {
    this._playerQueue.length = 0;
    this._emitter.emit(CONST.EVENT.STATE.RESET, {});
};

/**
 * Subscribes a player to the current question.
 *
 * @param {number} playerId The ID of the player to subscribe.
 */
QuizJsServer.prototype.subscribe = function(playerId) {
    if (this._playerQueue.indexOf(playerId) === -1) {
        this._playerQueue.push(playerId);
        this._updateState();
    }
};

/**
 * Updates the listeners with the current state.
 *
 * @fires QuizJsServer#EVENT.STATE.UPDATE
 */
QuizJsServer.prototype._updateState = function() {
    // Can also be undefined
    var speakerId = this._playerQueue[0];
    var data = {
        speakerId: speakerId
    };

    this._emitter.emit(CONST.EVENT.STATE.UPDATE, data);
};

QuizJsServer.prototype._registeredIds = 1;

QuizJsServer.prototype._playerQueue = null;

QuizJsServer.prototype._emitter = null;

QuizJsServer.prototype.on = function() {
    this._emitter.on.apply(this._emitter, arguments);
};

QuizJsServer.prototype.once = function() {
    this._emitter.once.apply(this._emitter, arguments);
};

QuizJsServer.prototype.removeListener = function() {
    this._emitter.removeListener.apply(this._emitter, arguments);
};

QuizJsServer.prototype.removeAllListener = function() {
    this._emitter.removeAllListeners.apply(this._emitter, arguments);
};

QuizJsServer.ACTION = CONST.ACTION;

QuizJsServer.EVENT = CONST.EVENT;

module.exports = QuizJsServer;