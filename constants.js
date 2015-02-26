module.exports = {

	/*
	 * Actions sent by the clients and master.
	 */
	ACTION: {
		CLIENT: {
			// Triggered when a client connects
			CONNECT: 'quizjs-client-connect',
			// Triggered when a client subscribes to a question
			SUBSCRIBE: 'quizjs-client-subscribe'
		},
		MASTER: {
			// Triggered when the master connects
			CONNECT: 'quizjs-master-connect',
			// Triggered when the master resets the state
			RESET: 'quizjs-master-reset',
			// Triggered when a client's answer was wrong and the master lets the next person answer
			NEXT: 'quizjs-master-next'
		}
	},

	/**
	 * Events sent by the server.
	 */
	EVENT: {
		CLIENT: {
			// Triggered when a client is registered to the server
			REGISTER: 'quizjs-client-register'
		},
		MASTER: {
			// Triggered when a client is registered to the server
			REGISTER: 'quizjs-master-register'
		},
		STATE: {
			RESET: 'quizjs-state-reset',
			UPDATE: 'quizjs-state-update'
		}
	}
	
};