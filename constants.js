module.exports = {

	/*
	 * Actions sent by players and master to the server.
	 */
	ACTION: {
		MASTER: {
			// Triggered when the master connects
			CONNECT: 'quizjs-master-connect',
			// Triggered when the state is reset
			RESET: 'quizjs-master-reset',
			// Triggered when it's another player's turn to answer
			NEXT: 'quizjs-master-next'
		},
		PLAYER: {
			// Triggered when a player connects
			CONNECT: 'quizjs-player-connect',
			// Triggered when a player subscribes to a question
			SUBSCRIBE: 'quizjs-player-subscribe'
		}
	},

	/**
	 * Events sent by server and client to their listeners.
	 */
	EVENT: {
		MASTER: {
			// Triggered when the master is registered to the server
			REGISTER: 'quizjs-master-register'
		},
		PLAYER: {
			// Triggered when a player is registered to the server
			REGISTER: 'quizjs-player-register'
		},
		STATE: {
			// Triggered when the state is reset
			RESET: 'quizjs-state-reset',
			// Triggered when the state is updated
			UPDATE: 'quizjs-state-update'
		}
	}
	
};