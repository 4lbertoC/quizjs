(function(window, undefined) {

	/*
	 * Actions sent by the master.
	 */
	var ACTION = {
		MASTER: {
			// Triggered when a master connects
			CONNECT: 'quizjs-master-connect',
			// Triggered when the master resets the state
			RESET: 'quizjs-master-reset',
			// Triggered when a client's answer was wrong and the master lets the next person answer
			NEXT: 'quizjs-master-next'
		}
	};

	/**
	 * Events sent by the server.
	 */
	var EVENT = {
		MASTER: {
			// Triggered when the master is registered to the server
			REGISTER: 'quizjs-master-register'
		},
		STATE: {
			RESET: 'quizjs-state-reset',
			UPDATE: 'quizjs-state-update'
		}
	};

	var socket;

	var connected = false;

	var eventHandlers = {};

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
			socket.emit(ACTION.MASTER.CONNECT);
		});

		socket.on(EVENT.MASTER.REGISTER, function(data) {
			connected = true;
			_callEventHandlers(EVENT.MASTER.REGISTER, data);
		});

		socket.on(EVENT.STATE.UPDATE, function(data) {
			_callEventHandlers(EVENT.STATE.UPDATE, data);
		});

		socket.on(EVENT.STATE.RESET, function(data) {
			_callEventHandlers(EVENT.STATE.RESET, data);
		});
	}

	function next() {
		if (connected) {
			socket.emit(ACTION.MASTER.NEXT);
		} else {
			console.error('Master not connected!');
		}
	}

	function reset() {
		if (connected) {
			socket.emit(ACTION.MASTER.RESET);
		} else {
			console.error('Master not connected!');
		}
	}

	var QuizJsMaster = window.QuizJsMaster = {
		connect: connect,
		next: next,
		reset: reset,
		on: on
	};

})(this);