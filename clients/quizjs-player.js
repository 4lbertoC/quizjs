(function(window, undefined) {

	/*
	 * Actions sent by the players.
	 */
	var ACTION = {
		PLAYER: {
			// Triggered when a player connects
			CONNECT: 'quizjs-player-connect',
			// Triggered when a player subscribes to a question
			SUBSCRIBE: 'quizjs-player-subscribe'
		}
	};

	/**
	 * Events sent by the server.
	 */
	var EVENT = {
		PLAYER: {
			// Triggered when a player is registered to the server
			REGISTER: 'quizjs-player-register'
		},
		STATE: {
			RESET: 'quizjs-state-reset',
			UPDATE: 'quizjs-state-update'
		}
	};

	var socket;

	var connected = false;

	var eventHandlers = {};

	var playerId;

	function _callEventHandlers(eventId, data) {
		var currentEventHandlers = eventHandlers[eventId];
		if (Array.isArray(currentEventHandlers)) {
			for (var i = 0, len = currentEventHandlers.length; i < len; i++) {
				currentEventHandlers[i](data);
			}
		}
	}

	function on(eventId, handler) {
		if (!eventHandlers[eventId]) {
			eventHandlers[eventId] = [];
		}

		eventHandlers[eventId].push(handler);
	} 

	function connect(url) {
		socket = io(url);

		socket.on('connect', function() {
			socket.emit(ACTION.PLAYER.CONNECT);
		});

		socket.on(EVENT.PLAYER.REGISTER, function(data) {
			connected = true;
			playerId = data.playerId;
			_callEventHandlers(EVENT.PLAYER.REGISTER, data);
		});

		socket.on(EVENT.STATE.UPDATE, function(data) {
			_callEventHandlers(EVENT.STATE.UPDATE, data);
		});

		socket.on(EVENT.STATE.RESET, function(data) {
			_callEventHandlers(EVENT.STATE.RESET, data);
		});
	}

	function subscribe() {
		if (connected) {
			socket.emit(ACTION.PLAYER.SUBSCRIBE, {
				playerId: playerId
			});
		} else {
			console.error('Player not connected!');
		}
	}

	var QuizJsPlayer = window.QuizJsPlayer = {
		connect: connect,
		subscribe: subscribe,
		on: on
	};

})(this);