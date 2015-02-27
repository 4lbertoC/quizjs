/*global describe, it */
'use strict';
var assert = require('assert');
var QuizJsServer = require('../');

describe('QuizJsServer', function() {

    describe('.registerPlayer()', function() {

        it('registers a new player and returns its id', function() {
            var qjs = new QuizJsServer();
            var playerId = qjs.registerPlayer();

            assert(typeof playerId !== 'undefined');
        });

        it('emits a QuizJsServer#EVENT.PLAYER.REGISTER event to its listeners', function() {
            var qjs = new QuizJsServer();
            var playerId;
            var eventPlayerId;
            var isCallbackCalled = false;

            qjs.on(QuizJsServer.EVENT.PLAYER.REGISTER, function(data) {
                eventPlayerId = data.playerId;
                isCallbackCalled = true;
            });

            playerId = qjs.registerPlayer();
            assert(isCallbackCalled, 'The QuizJsServer#EVENT.PLAYER.REGISTER callback has not been called');
            assert(eventPlayerId === playerId, 'The registered player\'s id is not included in the event data');
        });

    });

    describe('.subscribe(playerId)', function() {

        it('adds a player to the subscribers queue', function() {
            var qjs = new QuizJsServer();
            var player = qjs.registerPlayer();
            var speakerId;

            qjs.on(QuizJsServer.EVENT.STATE.UPDATE, function(data) {
                speakerId = data.speakerId;
            });

            qjs.subscribe(player);
            assert(speakerId === player, 'The subscribed player is not registered');
        });

        it('emits a QuizJsServer#EVENT.STATE.UPDATE event', function() {
            var qjs = new QuizJsServer();
            var player = qjs.registerPlayer();
            var isCallbackCalled = false;

            qjs.on(QuizJsServer.EVENT.STATE.UPDATE, function() {
                isCallbackCalled = true;
            });

            qjs.subscribe(player);
            assert(isCallbackCalled, 'The QuizJsServer#EVENT.STATE.UPDATE callback has not been called');
        });

    });

    describe('.nextSubscriber()', function() {

        it('gives the next player in the queue the possibility to answer', function() {
            var qjs = new QuizJsServer();
            var player1 = qjs.registerPlayer(); // player 1
            var player2 = qjs.registerPlayer(); // player 2
            var speakerId;

            qjs.on(QuizJsServer.EVENT.STATE.UPDATE, function(data) {
                speakerId = data.speakerId;
            });

            qjs.subscribe(player1); // queue = [1]
            qjs.subscribe(player2); // queue = [1, 2]
            qjs.nextSubscriber(); // queue = [2]

            assert(speakerId === player2, 'The last subscriber should be the one who can speak');
        });

        it('returns undefined if there are no subscribers', function() {
            var qjs = new QuizJsServer();
            var speakerId;

            qjs.on(QuizJsServer.EVENT.STATE.UPDATE, function(data) {
                speakerId = data.speakerId;
            });

            qjs.nextSubscriber(); // queue = []

            assert(typeof speakerId === 'undefined', 'Is not returning undefined if the queue is empty');
        });

        it('emits a QuizJsServer#EVENT.STATE.UPDATE event', function() {
            var qjs = new QuizJsServer();
            var isCallbackCalled = false;

            qjs.on(QuizJsServer.EVENT.STATE.UPDATE, function() {
                isCallbackCalled = true;
            });

            qjs.nextSubscriber();

            assert(isCallbackCalled, 'The QuizJsServer#EVENT.STATE.UPDATE callback has not been called');
        });

    });

    describe('.resetState()', function() {

        it('resets the state of the quiz', function() {
            var qjs = new QuizJsServer();
            var speakerId;

            // Register some players
            qjs.registerPlayer();
            qjs.registerPlayer();
            qjs.registerPlayer();
            qjs.resetState();

            qjs.on(QuizJsServer.EVENT.STATE.UPDATE, function(data) {
                speakerId = data.speakerId;
            });

            assert(typeof speakerId === 'undefined', 'The speaker id should be undefined after a reset');
        });

        it('emits a QuizJsServer#EVENT.STATE.RESET event', function() {
            var qjs = new QuizJsServer();
            var isCallbackCalled = false;

            qjs.on(QuizJsServer.EVENT.STATE.RESET, function() {
                isCallbackCalled = true;
            });

            qjs.resetState();

            assert(isCallbackCalled, 'The QuizJsServer#EVENT.STATE.RESET callback has not been called');
        });

    });
});