/**
 * QuizJs Server
 *
 * Copyright (c) Alberto Congiu
 * @4lbertoC
 *
 * Released under the MIT license.
 */

'use strict';

var emitter = require('event-emitter')({});

var CONST = require('./constants');

var clientQueue = [];

var registeredIds = 1;

function _updateState() {
	// Can also be undefined
	var speakerId = clientQueue[0];
	var data = {
		speakerId: speakerId
	};

	emitter.emit(CONST.EVENT.STATE.UPDATE, data);
}

module.exports = function() {

	return {
		// Constants
		ACTION: CONST.ACTION,
		EVENT: CONST.EVENT,

		// QuizJs methods
		resetState: function() {
			clientQueue.length = 0;
			emitter.emit(CONST.EVENT.STATE.RESET, {});
		},

		nextSubscriber: function() {
			clientQueue.shift();
			_updateState();
		},

		registerNewClient: function() {
			var clientId = registeredIds++;

			emitter.emit(CONST.EVENT.CLIENT.REGISTER, {
				clientId: clientId
			});

			return clientId;
		},

		subscribe: function(clientId) {
			if (clientQueue.indexOf(clientId) === -1) {
				clientQueue.push(clientId);
				_updateState();
			}
		},

		// event-emitter methods
		on: emitter.on.bind(emitter),
		off: emitter.off.bind(emitter),
		once: emitter.once.bind(emitter)
	};

};