/**
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

var QuizJsServer = function() {
    this._clientQueue = [];
};

QuizJsServer.prototype.nextSubscriber = function() {
    this._clientQueue.shift();
    this._updateState();
};

QuizJsServer.prototype.registerClient = function() {
    var clientId = this._registeredIds++;

    this._emitter.emit(CONST.EVENT.CLIENT.REGISTER, {
        clientId: clientId
    });

    return clientId;
};

QuizJsServer.prototype.resetState = function() {
    this._clientQueue.length = 0;
    this._emitter.emit(CONST.EVENT.STATE.RESET, {});
};

QuizJsServer.prototype.subscribe = function(clientId) {
    if (this._clientQueue.indexOf(clientId) === -1) {
        this._clientQueue.push(clientId);
        this._updateState();
    }
};

QuizJsServer.prototype._updateState = function() {
    // Can also be undefined
    var speakerId = this._clientQueue[0];
    var data = {
        speakerId: speakerId
    };

    this._emitter.emit(CONST.EVENT.STATE.UPDATE, data);
};

QuizJsServer.prototype._registeredIds = 1;

QuizJsServer.prototype._clientQueue;

QuizJsServer.prototype._emitter = new events.EventEmitter();

QuizJsServer.prototype.on = function(eventId, callback) {
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